import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

export const MathProblemView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const problemPrompt = typeof content.problemPrompt === 'string' ? content.problemPrompt : '';
  const givenDataPrompt = typeof content.givenDataPrompt === 'string' ? content.givenDataPrompt : 'Dados / Esquema C.R.A.';
  const operationPrompt = typeof content.operationPrompt === 'string' ? content.operationPrompt : 'Operação / Cálculo (Grelha)';
  const answerPrompt = typeof content.answerPrompt === 'string' ? content.answerPrompt : 'Resposta completa';

  return (
    <div className="space-y-3.5 tabular-math">
      {problemPrompt && (
        <div className={`font-medium zorzi-typography neuro-surface-box p-3 rounded-lg border-[1.5px] ${fontSizeClass}`}>
          {problemPrompt}
        </div>
      )}

      {/* Caixa Dupla: Dados & Esquema C.R.A. vs Operações com Quadrícula 5mm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-h-[125px]">
        {/* Caixa Dados / Esquema Pictórico */}
        <div className="border-[1.5px] border-slate-600 rounded-lg p-2.5 flex flex-col bg-white">
          <span className="text-xs font-bold neuro-accent-text uppercase tracking-wider border-b-[1.5px] border-slate-400 pb-1 mb-1">
            {givenDataPrompt}
          </span>
          <div className="flex-1 min-h-[90px]" />
        </div>

        {/* Caixa Operações com Quadrícula Matemática de Alto Contraste */}
        <div className="border-[1.5px] border-slate-600 rounded-lg p-2.5 flex flex-col bg-white quadricula-matematica-5mm">
          <span className="text-xs font-bold neuro-accent-text uppercase tracking-wider border-b-[1.5px] border-slate-400 pb-1 mb-1 bg-white px-1">
            {operationPrompt}
          </span>
          <div className="flex-1 min-h-[90px]" />
        </div>
      </div>

      {/* Linha de Resposta Completa com altura muscular de 10-12mm e fio #475569 */}
      <div className="pt-1 flex items-baseline gap-2.5">
        <span className="font-bold text-sm whitespace-nowrap">
          R. ({answerPrompt}):
        </span>
        <div className="flex-1 border-b-[1.5px] border-slate-600 h-9 print-ink-line" />
      </div>
    </div>
  );
};
