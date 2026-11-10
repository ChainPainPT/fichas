import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Renderiza atividades de Associação de Códigos com Quadrícula de Resposta [ ]
 * (ex: Grupo IV da Ficha de Estudo do Meio - Hábitos de Saúde e Cidadania).
 * Mantém a legenda de códigos e todos os cartões juntos na mesma folha A4 sem partir ao meio.
 */
export const CodeMatchingView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const codeData = content.codeMatching || {
    legendCodes: [
      'A — Sistema Respiratório',
      'B — Sistema Circulatório',
      'C — Sistema Digestivo',
      'D — Sistema Excretor'
    ],
    items: Array.isArray(content.statements) ? content.statements.map(String) : []
  };

  const legendCodes = Array.isArray(codeData.legendCodes) ? codeData.legendCodes : [];
  const items = Array.isArray(codeData.items) ? codeData.items : [];

  return (
    <div className="space-y-3">
      {/* Barra de Legenda de Códigos */}
      {legendCodes.length > 0 && (
        <div className="rounded-xl border-[1.5px] neuro-surface-box p-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-extrabold print:bg-white print:border-slate-800">
          {legendCodes.map((code, idx) => (
            <React.Fragment key={idx}>
              <span className="neuro-accent-text print:text-black">{String(code)}</span>
              {idx < legendCodes.length - 1 && (
                <span className="text-slate-300 print:text-slate-500">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Lista de Itens com Quadrícula de Escrita [ ] */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const text = String(item);
          const hasNumberPrefix = /^\d+[\.\)]/.test(text.trim());
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3 rounded-xl border-[1.5px] border-slate-300 bg-white/95 print:bg-white print:border-slate-800"
            >
              <div
                className="w-9 h-8 rounded-lg border-[1.5px] border-slate-600 bg-white flex-shrink-0 print:border-black"
                aria-label="Quadrícula de resposta"
              />
              <div className={`zorzi-typography font-medium text-slate-900 print:text-black ${fontSizeClass}`}>
                {!hasNumberPrefix && (
                  <strong className="font-extrabold mr-1.5">{idx + 1}.</strong>
                )}
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
