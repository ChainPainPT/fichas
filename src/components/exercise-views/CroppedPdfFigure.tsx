import React, { useEffect, useRef, useState } from 'react';
import { FigureCropData } from '../../types/worksheet';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  figureCrop?: FigureCropData;
  documentPages?: string[];
  alt?: string;
}

/**
 * Recorta com precisão milimétrica (via HTML5 Canvas) uma ilustração, desenho ou esquema
 * diretamente da página renderizada do PDF/imagem original enviado pelo professor.
 */
export const CroppedPdfFigure: React.FC<Props> = ({
  figureCrop,
  documentPages = [],
  alt = 'Ilustração científica do documento original'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const pageIdx = (figureCrop?.pageIndex || 1) - 1;
  const sourcePageUrl =
    figureCrop?.imageUrl ||
    (pageIdx >= 0 && pageIdx < documentPages.length ? documentPages[pageIdx] : null);

  useEffect(() => {
    if (!sourcePageUrl) {
      setCroppedDataUrl(null);
      return;
    }

    // If direct imageUrl without box2d crop or full image
    const box = figureCrop?.box2d;
    if (!box || box.length !== 4 || (box[0] === 0 && box[1] === 0 && box[2] === 1000 && box[3] === 1000)) {
      setCroppedDataUrl(sourcePageUrl);
      setLoadFailed(false);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const [ymin, xmin, ymax, xmax] = box;
        const sx = Math.max(0, Math.floor((xmin / 1000) * img.width));
        const sy = Math.max(0, Math.floor((ymin / 1000) * img.height));
        const sw = Math.max(40, Math.floor(((xmax - xmin) / 1000) * img.width));
        const sh = Math.max(40, Math.floor(((ymax - ymin) / 1000) * img.height));

        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, sw, sh);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          setCroppedDataUrl(canvas.toDataURL('image/png'));
          setLoadFailed(false);
        }
      } catch {
        setCroppedDataUrl(sourcePageUrl);
      }
    };
    img.onerror = () => {
      if (!cancelled) setLoadFailed(true);
    };
    img.src = sourcePageUrl;

    return () => {
      cancelled = true;
    };
  }, [sourcePageUrl, figureCrop?.box2d]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-[1.5px] neuro-surface-box p-2.5 bg-white/95 print:bg-white print:border-slate-800">
      <canvas ref={canvasRef} className="hidden" />
      {croppedDataUrl && !loadFailed ? (
        <img
          src={croppedDataUrl}
          alt={figureCrop?.caption || alt}
          className="max-h-[230px] w-auto object-contain rounded-lg mx-auto"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-2">
          <ImageIcon className="w-8 h-8 neuro-accent-text opacity-70" />
          <span className="text-xs font-semibold text-slate-600">
            {figureCrop?.caption || 'Esquema / Ilustração do Documento'}
          </span>
        </div>
      )}
      {figureCrop?.caption && (
        <span className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 print:text-black">
          {figureCrop.caption}
        </span>
      )}
    </div>
  );
};
