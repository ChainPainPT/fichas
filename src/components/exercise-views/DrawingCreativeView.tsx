import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

export const DrawingCreativeView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const drawingPrompt = typeof content.drawingPrompt === 'string' ? content.drawingPrompt : '';
  const boxHeight = content.boxHeight || 'normal';

  const heightClass = 
    boxHeight === 'compact' ? 'h-32' :
    boxHeight === 'large' ? 'h-56' : 'h-44';

  return (
    <div className="space-y-2">
      {drawingPrompt && (
        <div className={`italic font-medium ${fontSizeClass}`}>
          ✏️ {drawingPrompt}
        </div>
      )}

      {/* Moldura de Desenho */}
      <div
        className={`w-full ${heightClass} border-2 border-dashed border-slate-400 rounded-xl neuro-surface-box print:bg-white print:border-slate-400 flex flex-col items-center justify-center relative p-3`}
      >
        <span className="text-xs text-slate-500 font-medium no-print">
          [ Espaço reservado para o desenho e pintura do aluno ]
        </span>
        {/* Cantos decorativos sutis */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-400" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-400" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-400" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-400" />
      </div>
    </div>
  );
};
