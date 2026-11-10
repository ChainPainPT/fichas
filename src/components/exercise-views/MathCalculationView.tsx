import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
  grade?: string;
}

/**
 * Norma Secção 2.A.3 & 5.C:
 * - Tabular Figures (font-variant-numeric: tabular-nums) para alinhar C-D-U
 * - Grelha quadriculada de 5x5mm (3º/4º ano) ou 7x7mm (1º/2º ano) com contorno cinzento escuro (#475569)
 */
export const MathCalculationView: React.FC<Props> = ({ exercise, fontSizeClass, grade }) => {
  const content = exercise?.content || {};
  const calculations = Array.isArray(content.calculations) ? content.calculations : [];
  const cols = exercise?.layoutCols || 3;
  const isEarlyYears = grade === '1º Ano' || grade === '2º Ano';

  const gridColsClass = 
    cols === 1 ? 'grid-cols-1' :
    cols === 2 ? 'grid-cols-2' : 'grid-cols-3';

  const gridPatternClass = isEarlyYears ? 'quadricula-matematica-7mm' : 'quadricula-matematica-5mm';

  return (
    <div className={`grid ${gridColsClass} gap-3 sm:gap-4 tabular-math`}>
      {calculations.map((calc, idx) => {
        const isVertical = calc?.vertical !== false;
        const showGrid = calc?.showGrid !== false;

        return (
          <div
            key={idx}
            className={`border-[1.5px] border-slate-700 rounded-lg p-3 flex flex-col items-center justify-between min-h-[120px] bg-white ${
              showGrid ? gridPatternClass : ''
            }`}
          >
            {/* Etiqueta / Alínea da operação */}
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span className="bg-white px-1 rounded">{String.fromCharCode(97 + idx)})</span>
              <span className="text-[10px] font-mono text-slate-600 bg-white px-1">C D U</span>
            </div>

            {isVertical ? (
              /* Conta armada verticalmente (CDU - Tabular Figures) */
              <div className="w-28 bg-white/95 px-2.5 py-1.5 rounded border border-slate-400 tabular-math text-right text-lg font-bold text-slate-900">
                <div className="tracking-[0.22em]">{calc.term1 || '45'}</div>
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-0.5 tracking-[0.22em]">
                  <span className="text-base font-extrabold pl-0.5">{calc.operator || '+'}</span>
                  <span>{calc.term2 || '23'}</span>
                </div>
                {/* Espaço muscular para escrever o resultado a lápis */}
                <div className="h-8 pt-1 text-transparent select-none">___</div>
              </div>
            ) : (
              /* Conta horizontal com caixa de resposta de contorno 1.5pt preto sobre branco puro */
              <div className={`w-full flex items-center justify-center gap-2 py-3 bg-white/95 rounded tabular-math font-bold text-slate-900 ${fontSizeClass}`}>
                <span>{calc.operation || `${calc.term1 || '20'} ${calc.operator || '+'} ${calc.term2 || '15'} =`}</span>
                <span className="inline-block w-14 h-8 border-[1.5px] border-slate-800 rounded bg-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
