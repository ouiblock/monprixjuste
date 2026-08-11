import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  iconSize?: number;
}

export default function Tooltip({ content, position = 'top', className = '', iconSize = 14 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }
    if (visible) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible]);

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses: Record<string, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center cursor-help ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(v => !v)}
      role="button"
      aria-label="Aide contextuelle"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setVisible(v => !v)}
    >
      <Info
        size={iconSize}
        className="text-gray-400 hover:text-[#ff6d11] transition-colors flex-shrink-0"
      />
      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-72 max-w-xs ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed">
            {content}
          </div>
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </span>
  );
}
