import { useState, useRef, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  iconSize?: number;
}

export default function Tooltip({ content, position = 'top', className = '', iconSize = 13 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'top' | 'bottom' }>({
    top: 0,
    left: 0,
    placement: 'top',
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = Math.min(288, window.innerWidth - 24);
    const margin = 12;

    // Horizontal clamping so tooltip NEVER overflows off-screen on mobile or desktop
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < margin) left = margin;
    if (left + tooltipWidth > window.innerWidth - margin) {
      left = window.innerWidth - margin - tooltipWidth;
    }

    // Vertical placement: prefer top unless too close to top of viewport
    const preferBottom = position === 'bottom' || rect.top < 140;
    const top = preferBottom ? rect.bottom + 8 : rect.top - 8;

    setCoords({
      top,
      left,
      placement: preferBottom ? 'bottom' : 'top',
    });
  }, [position]);

  useEffect(() => {
    if (!visible) return;
    updatePosition();

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    }

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [visible, updatePosition]);

  return (
    <span className={`inline-flex items-center align-middle ${className}`}>
      <button
        ref={containerRef}
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVisible((v) => !v);
        }}
        aria-label="Informations complémentaires"
        aria-expanded={visible}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-50 text-[#ff6d11] border border-orange-200/80 hover:bg-[#ff6d11] hover:text-white hover:border-[#ff6d11] focus:outline-none focus:ring-2 focus:ring-[#ff6d11]/40 transition-all cursor-help flex-shrink-0 shadow-2xs"
      >
        <Info size={iconSize} className="stroke-[2.5]" aria-hidden="true" />
      </button>

      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            top: coords.placement === 'bottom' ? `${coords.top}px` : undefined,
            bottom: coords.placement === 'top' ? `${window.innerHeight - coords.top}px` : undefined,
            left: `${coords.left}px`,
            width: `${Math.min(288, window.innerWidth - 24)}px`,
            zIndex: 9999,
          }}
          className="pointer-events-auto animate-fade-in"
        >
          <div className="bg-gray-900 text-white text-xs font-normal rounded-xl px-3.5 py-2.5 shadow-2xl border border-gray-700/80 leading-relaxed text-left">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#ff6d11] text-white text-[10px] font-black flex-shrink-0 mt-0.5">
                i
              </span>
              <span>{content}</span>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
