import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

export const TrueFalseView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const statements = Array.isArray(content.statements) ? content.statements : [];

  return (
    <div className="space-y-3">
      {statements.map((stmt, idx) => {
        const stmtStr = typeof stmt === 'string'
          ? stmt
          : typeof stmt === 'object' && stmt !== null
          ? String((stmt as any).statement || (stmt as any).text || '')
          : String(stmt ?? '');
        return (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 p-2.5 rounded-lg border-[1.5px] neuro-surface-box"
          >
            <div className="flex items-start gap-2.5 flex-1">
              <span className="font-bold neuro-accent-text text-xs mt-1">{String.fromCharCode(97 + idx)})</span>
              <span className={`zorzi-typography ${fontSizeClass}`}>{stmtStr}</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-7 border-[1.5px] border-slate-700 rounded-xs font-bold text-xs bg-white">
                V
              </div>
              <div className="flex items-center justify-center w-8 h-7 border-[1.5px] border-slate-700 rounded-xs font-bold text-xs bg-white">
                F
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
