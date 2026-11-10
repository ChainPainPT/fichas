import React from 'react';
import { WorksheetConfig } from '../types/worksheet';

interface Props {
  config: WorksheetConfig;
  onUpdateConfig?: (updates: Partial<WorksheetConfig>) => void;
}

/**
 * Norma Secção 4: O Cabeçalho Oficial Standard (DGE / IAVE / EB da Lejana)
 * Compacto (32mm a 35mm), funcional, largura total A4, com Menção Qualitativa + Rúbrica DUA
 */
export const WorksheetHeader: React.FC<Props> = ({ config }) => {
  const {
    schoolName,
    subject,
    grade,
    term,
    title,
    subtitle,
    studentFields,
    evaluationMode = 'qualitative',
    showDuaRubric = true,
    showTeacherSignature = true,
    showGuardianSignature = true
  } = config || ({} as WorksheetConfig);

  const fields = studentFields || {
    showName: true,
    showDate: true,
    showGradeTurma: true,
    showNumber: true
  };

  return (
    <div className="worksheet-header mb-4 space-y-2.5">
      {/* Grelha Oficial DGE / IAVE / EB da Lejana harmonizada com Paleta Neuro-Acolhedora */}
      <header className="border-[1.5px] border-slate-700 rounded-lg bg-white overflow-hidden">
        {/* Topo: Escola, Ano Letivo, Disciplina e Ano */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 border-b-[1.5px] border-slate-600 neuro-surface-box">
          <div>
            <div className="font-extrabold text-xs sm:text-sm uppercase tracking-wider">
              {schoolName || 'ESCOLA BÁSICA DA LEJANA — FARO'}
            </div>
            <div className="text-[11px] font-medium text-slate-600">
              1.º Ciclo do Ensino Básico • {term || 'Ano Letivo 2025/2026'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border-[1.5px] neuro-soft-chip print:border-slate-900 print:text-black">
              {subject || 'Português'}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border-[1.5px] border-slate-700 bg-white">
              {grade || '2º Ano'}
            </span>
          </div>
        </div>

        {/* Corpo Dividido: Identificação do Aluno (Esquerda) | Menção Qualitativa & Rúbrica DUA (Direita) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x-[1.5px] divide-slate-600">
          {/* Coluna Esquerda (8 cols): Nome, Nº, Turma, Data, Prof, E.E. */}
          <div className="sm:col-span-8 p-3 space-y-2.5 text-xs font-semibold">
            {fields.showName && (
              <div className="flex items-baseline gap-2">
                <span className="font-bold">Nome:</span>
                <div className="flex-1 border-b-[1.5px] border-slate-600 h-5 print-ink-line" />
              </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-3 pt-0.5">
              {fields.showNumber && (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold">N.º:</span>
                  <span className="inline-block w-10 border-[1.5px] border-slate-600 rounded-xs h-5 bg-white" />
                </div>
              )}

              {fields.showGradeTurma && (
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold">Turma:</span>
                  <span className="inline-block w-14 border-[1.5px] border-slate-600 rounded-xs h-5 bg-white" />
                </div>
              )}

              {fields.showDate && (
                <div className="flex items-baseline gap-1.5 flex-1 min-w-[140px]">
                  <span className="font-bold">Data:</span>
                  <div className="flex-1 border-b-[1.5px] border-slate-600 h-5 text-center font-normal text-slate-600">
                    ____ / ____ / 2026
                  </div>
                </div>
              )}
            </div>

            {(showTeacherSignature || showGuardianSignature) && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                {showTeacherSignature && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold whitespace-nowrap">Prof.:</span>
                    <div className="flex-1 border-b-[1.5px] border-slate-600 h-4 print-ink-line" />
                  </div>
                )}
                {showGuardianSignature && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold whitespace-nowrap">E.E.:</span>
                    <div className="flex-1 border-b-[1.5px] border-slate-600 h-4 print-ink-line" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coluna Direita (4 cols): Menção Qualitativa & Rúbrica DUA */}
          {evaluationMode !== 'none' && (
            <div className="sm:col-span-4 p-2.5 neuro-surface-box flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5 border-b border-slate-300 pb-0.5">
                  Menção Qualitativa
                </div>

                {evaluationMode === 'faces' && (
                  <div className="grid grid-cols-3 gap-1 text-[11px] font-semibold py-1">
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 inline-block bg-white" /> 😊 M.B.
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 inline-block bg-white" /> 🙂 Bom
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 inline-block bg-white" /> 😐 Suf.
                    </span>
                  </div>
                )}

                {evaluationMode === 'qualitative' && (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 rounded-xs inline-block bg-white" /> Insuf.
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 rounded-xs inline-block bg-white" /> Suf.
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 rounded-xs inline-block bg-white" /> Bom
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-slate-700 rounded-xs inline-block bg-white" /> Muito Bom
                    </span>
                  </div>
                )}

                {(evaluationMode === 'percentage' || evaluationMode === 'points') && (
                  <div className="flex items-center justify-between text-xs font-bold py-1">
                    <span>Classificação:</span>
                    <span className="inline-block w-16 border-b-[1.5px] border-slate-700 text-center">___</span>
                    <span>{evaluationMode === 'percentage' ? '%' : 'pts'}</span>
                  </div>
                )}
              </div>

              {/* Rúbrica DUA (Decreto-Lei n.º 54/2018) */}
              {showDuaRubric && (
                <div className="mt-2 pt-1.5 border-t border-slate-300 flex items-center justify-between text-[10px] font-bold">
                  <span>Rúbrica DUA:</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      N1 <span className="w-3 h-3 border-[1.5px] border-slate-700 inline-block bg-white" />
                    </span>
                    <span className="flex items-center gap-0.5">
                      N2 <span className="w-3 h-3 border-[1.5px] border-slate-700 inline-block bg-white" />
                    </span>
                    <span className="flex items-center gap-0.5">
                      N3 <span className="w-3 h-3 border-[1.5px] border-slate-700 inline-block bg-white" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Título Principal do Recurso (Secção 2.B: 18-20pt para 1º/2º, 16-18pt para 3º/4º) */}
      <div className="pt-1 pb-0.5">
        <h1 className="text-xl sm:text-2xl font-extrabold neuro-accent-text print:text-black leading-tight tracking-tight">
          {title || 'Ficha de Trabalho e Consolidação'}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
