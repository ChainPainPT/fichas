import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

export const FreeResponseView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const questionPrompt = typeof content.questionPrompt === 'string' ? content.questionPrompt : '';
  const responseLinesCount = Number(content.responseLinesCount) || 3;
  const lines = Array.from({ length: Math.max(Math.min(responseLinesCount, 10), 2) });

  return (
    <div className="space-y-3">
      {questionPrompt && (
        <div className={`font-medium zorzi-typography ${fontSizeClass}`}>
          {questionPrompt}
        </div>
      )}

      {/* Linhas de Resposta Muscular (10mm a 12mm de altura, cor #475569 / 1.5px) */}
      <div className="space-y-1 pt-1">
        {lines.map((_, idx) => (
          <div
            key={idx}
            className="border-b-[1.5px] border-slate-600 print-ink-line h-9 w-full"
          />
        ))}
      </div>
    </div>
  );
};
