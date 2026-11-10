import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Norma Secção 5.B: Exercícios de Correspondência ("Ligar com Setas")
 * 1. Pontos de Ancoragem: Círculos pretos bem visíveis (●)
 * 2. Distância Central Livre: 45mm a 55mm de espaço vazio horizontal para traçar com régua
 * 3. Contornos de caixas sólidas de 1.5pt sobre fundo branco #FFFFFF
 */
export const MatchingView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const pairs = Array.isArray(content.matchingPairs) ? content.matchingPairs : [];

  return (
    <div className="py-1.5">
      <div className="space-y-3.5">
        {pairs.map((pair, idx) => {
          const leftText = typeof pair?.left === 'string' ? pair.left : String(pair?.left ?? '');
          const rightText = typeof pair?.right === 'string' ? pair.right : String(pair?.right ?? '');
          return (
            <div key={idx} className="flex items-center justify-between">
              {/* Coluna A (Esquerda) */}
              <div className="flex-1 flex items-center justify-between neuro-surface-box border-[1.5px] rounded-md px-3.5 py-2.5">
                <span className={`font-semibold zorzi-typography ${fontSizeClass}`}>
                  {leftText}
                </span>
                {/* Ponto de Ancoragem (●) */}
                <span
                  aria-hidden="true"
                  className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-800 ml-3 flex-shrink-0"
                />
              </div>

              {/* Zona Central Livre de 45mm a 55mm (w-36 a w-48) para traçar com régua sem riscar texto */}
              <div
                className="w-28 sm:w-44 flex items-center justify-center flex-shrink-0 px-2"
                title="Zona livre (45-55mm) para o aluno traçar com régua"
              >
                <div className="w-full border-b border-dotted border-slate-400/50 print:border-transparent" />
              </div>

              {/* Coluna B (Direita) */}
              <div className="flex-1 flex items-center justify-start neuro-surface-box border-[1.5px] rounded-md px-3.5 py-2.5">
                {/* Ponto de Ancoragem (●) */}
                <span
                  aria-hidden="true"
                  className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-800 mr-3 flex-shrink-0"
                />
                <span className={`font-medium zorzi-typography ${fontSizeClass}`}>
                  {rightText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
