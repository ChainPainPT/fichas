import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Norma Secção 5.A: Perguntas de Escolha Múltipla (Grelha de 2 Colunas Simétricas)
 * Coluna Esquerda: A e B | Coluna Direita: C e D
 * Caixa da Letra: Quadrado 7x7mm com letra centrada a negrito
 * Espaço vertical entre opções: mínimo 8mm
 */
export const MultipleChoiceView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const contextText = typeof content.contextText === 'string' ? content.contextText : '';
  const question = typeof content.question === 'string' ? content.question : '';
  const rawOptions = Array.isArray(content.options) && content.options.length > 0
    ? content.options
    : ['Opção A', 'Opção B', 'Opção C', 'Opção D'];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-3">
      {contextText && (
        <p className={`zorzi-typography text-slate-800 print:text-black ${fontSizeClass}`}>
          {contextText}
        </p>
      )}

      {question && (
        <div className={`font-semibold zorzi-typography text-slate-900 print:text-black ${fontSizeClass}`}>
          {question}
        </div>
      )}

      {/* Grelha de 2 Colunas Simétricas com respiro vertical de 8mm (gap-y-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-1">
        {rawOptions.map((opt, idx) => {
          const optStr = typeof opt === 'string'
            ? opt
            : typeof opt === 'object' && opt !== null
            ? String((opt as any).text || (opt as any).option || (opt as any).label || (opt as any).value || '')
            : String(opt ?? '');

          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl border-[1.5px] neuro-surface-box bg-white/95 print:bg-white print:border-slate-800"
            >
              {/* Caixa da Letra 7x7mm (w-7 h-7) para assinalar com X */}
              <div className="w-7 h-7 mt-0.5 border-[1.5px] border-slate-700 rounded-xs flex items-center justify-center font-bold text-sm bg-white flex-shrink-0 print:border-black">
                {letters[idx] || String(idx + 1)}
              </div>
              <span className={`font-normal zorzi-typography leading-snug ${fontSizeClass}`}>
                {optStr.replace(/^(\[?[a-dA-D]\]?[\)\.\-]?\s*)/, '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
