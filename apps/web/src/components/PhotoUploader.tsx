import { useRef, useState } from 'react';
import { Camera, ImagePlus, Star, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import Tooltip from './Tooltip';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  title?: string;
  subtitle?: string;
  maxPhotos?: number;
}

/**
 * Compresses and converts any uploaded image file to a standard JPEG data URL
 * so jsPDF can embed it reliably and localStorage stays light.
 */
function compressImageToJpeg(file: File, maxWidth = 1200, maxHeight = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        // Fill white background for transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

export default function PhotoUploader({
  photos = [],
  onChange,
  title = 'Photos du bien',
  subtitle = 'Ajoutez jusqu\'à 6 photos locales pour documenter votre bien. La première photo servira d\'illustration principale.',
  maxPhotos = 6,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) return;

    setIsLoading(true);
    try {
      const files = Array.from(fileList)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, remainingSlots);
      const compressed = await Promise.all(files.map((f) => compressImageToJpeg(f)));
      onChange([...photos, ...compressed]);
    } catch (err) {
      console.error('Erreur lors du traitement des photos:', err);
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const setAsCover = (index: number) => {
    if (index === 0 || index < 0 || index >= photos.length) return;
    const updated = [...photos];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 rounded-2xl border-2 border-orange-200/80 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-[#ff6d11] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Camera className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-gray-900">
            {title}
          </h3>
          <Tooltip
            content="Ajoutez des photos pour illustrer votre dossier. Vos images sont compressées et restent à 100% sur votre appareil (aucun transfert serveur)."
            position="top"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6d11] bg-white px-3 py-1 rounded-full border border-orange-200 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          {photos.length} / {maxPhotos} photo{photos.length > 1 ? 's' : ''}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
        {subtitle}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Upload Dropzone */}
      {photos.length < maxPhotos && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all ${
            isDragging
              ? 'border-[#ff6d11] bg-orange-50'
              : 'border-gray-300 bg-white/90 hover:border-[#ff6d11] hover:bg-orange-50/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-[#ff6d11] flex items-center justify-center flex-shrink-0">
              <ImagePlus className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-gray-900">
                {isLoading
                  ? 'Optimisation des photos en cours...'
                  : photos.length === 0
                  ? 'Ajouter une photo principale et d\'autres vues'
                  : 'Ajouter d\'autres photos à la galerie'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                JPG, PNG, WebP — Traitement 100% local sur votre appareil (aucun envoi serveur)
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-2 sm:mt-0 sm:ml-auto px-4 py-2 bg-[#ff6d11] hover:bg-[#e65a00] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Parcourir mes photos
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((src, idx) => {
            const isCover = idx === 0;
            return (
              <div
                key={idx}
                className={`relative group rounded-xl overflow-hidden border-2 bg-white transition-all ${
                  isCover
                    ? 'border-[#ff6d11] ring-2 ring-[#ff6d11]/20 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video w-full bg-gray-100 overflow-hidden relative">
                  <img
                    src={src}
                    alt={isCover ? 'Photo principale' : `Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isCover && (
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ff6d11] text-white text-[11px] font-bold shadow-md">
                      <Star className="w-3 h-3 fill-white" />
                      Photo principale
                    </div>
                  )}
                </div>

                <div className="p-2.5 flex items-center justify-between gap-2 bg-white">
                  {isCover ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      Photo principale (Une)
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAsCover(idx)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-[#ff6d11] bg-gray-100 hover:bg-orange-50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <Star className="w-3 h-3" />
                      Mettre en tête de page
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                    aria-label={`Supprimer la photo ${idx + 1}`}
                    title="Supprimer cette photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

