import React from 'react';
import { WorksheetConfig } from '../types/worksheet';

interface Props {
  config: WorksheetConfig;
}

export const WorksheetFooter: React.FC<Props> = ({ config }) => {
  const { showTeacherSignature, showGuardianSignature, selfAssessment } = config;

  return (
    <footer className="worksheet-footer mt-5 space-y-4 print:mt-4">
      {/* Barra de Autoavaliação do Aluno (ex: Autoavaliação do Explorador) */}
      {selfAssessment && selfAssessment.title && (
        <div
          data-no-break="true"
          className="exercise-avoid-break rounded-xl border-[1.5px] neuro-surface-box p-3.5 flex flex-wrap items-center justify-between gap-4 print:bg-white print:border-slate-800"
        >
          <div className="font-extrabold text-xs sm:text-sm text-slate-900 print:text-black">
            🧭 {selfAssessment.title}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-slate-800 print:text-black">
            {(selfAssessment.options || []).map((opt, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5">
                <span>{String(opt)}</span>
                <span className="w-5 h-5 rounded border-[1.5px] border-slate-700 bg-white inline-block print:border-black" />
              </span>
            ))}
          </div>
        </div>
      )}

      {(showTeacherSignature || showGuardianSignature) && (
        <div className="pt-3 border-t border-slate-300 text-xs text-slate-600 print:pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Assinatura do Professor */}
            {showTeacherSignature && (
              <div className="flex items-baseline gap-2 flex-1 min-w-[180px]">
                <span className="font-semibold text-slate-700 whitespace-nowrap">
                  O(A) Professor(a):
                </span>
                <div className="flex-1 border-b border-dotted border-slate-400 h-4" />
              </div>
            )}

            {/* Mensagem motivacional para 1º Ciclo */}
            <div className="text-center font-medium italic text-slate-500 text-[11px] px-2">
              Bom trabalho! Faz com atenção e capricho. ✨
            </div>

            {/* Assinatura do Encarregado de Educação */}
            {showGuardianSignature && (
              <div className="flex items-baseline gap-2 flex-1 min-w-[200px]">
                <span className="font-semibold text-slate-700 whitespace-nowrap">
                  O(A) Enc. de Educação:
                </span>
                <div className="flex-1 border-b border-dotted border-slate-400 h-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
