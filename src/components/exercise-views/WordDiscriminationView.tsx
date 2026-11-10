import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Renderiza atividades de Discriminação de Conceitos ("Risca com um traço a palavra INCORRETA")
 * transformando pares inline como [reprodutor / excretor] em caixas destacadas dentro da frase
 * (ex: Grupo III da Ficha de Estudo do Meio).
 */
export const WordDiscriminationView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const rawSentences = Array.isArray(content.discriminationSentences)
    ? content.discriminationSentences
    : Array.isArray(content.statements)
    ? content.statements
    : [];

  const renderSentenceWithChoicePills = (sentence: string) => {
    // Matches [opção1 / opção2] or **opção1 / opção2**
    const parts = String(sentence).split(/(\[[^\]]+\/[^\]]+\]|\*\*[^*]+\/[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (
        (part.startsWith('[') && part.endsWith(']') && part.includes('/')) ||
        (part.startsWith('**') && part.endsWith('**') && part.includes('/'))
      ) {
        const clean = part.replace(/^\[|\]$|^\*\*|\*\*$/g, '').trim();
        return (
          <span
            key={idx}
            className="inline-flex items-center px-2.5 py-0.5 mx-1 rounded-md border-[1.5px] border-slate-500 bg-white font-extrabold text-slate-900 shadow-2xs print:border-black print:text-black"
          >
            {clean}
          </span>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-3">
      {content.discriminationExample && (
        <div className="text-xs italic text-slate-600 print:text-black">
          ({String(content.discriminationExample)})
        </div>
      )}

      <div className="rounded-xl border-[1.5px] neuro-surface-box p-4 space-y-3.5 print:bg-white print:border-slate-800">
        {rawSentences.map((rawSentence, idx) => {
          const text = String(rawSentence);
          const hasLetterPrefix = /^[a-z]\)/i.test(text.trim());
          return (
            <div key={idx} className={`leading-[2.0] zorzi-typography ${fontSizeClass}`}>
              {!hasLetterPrefix && (
                <span className="font-extrabold neuro-accent-text mr-1.5 print:text-black">
                  {String.fromCharCode(97 + idx)})
                </span>
              )}
              <span>{renderSentenceWithChoicePills(text)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
