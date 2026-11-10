import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

export const FillBlankView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const wordBank = Array.isArray(content.wordBank) ? content.wordBank : [];
  const sentencesWithBlanks = Array.isArray(content.sentencesWithBlanks) ? content.sentencesWithBlanks : [];

  return (
    <div className="space-y-3">
      {content.contextText && (
        <p className={`zorzi-typography text-slate-800 print:text-black ${fontSizeClass}`}>
          {String(content.contextText)}
        </p>
      )}

      {/* Caixa de Palavras de Apoio Neuro-Acolhedora */}
      {wordBank.length > 0 && (
        <div className="p-3 rounded-xl border-[1.5px] neuro-surface-box print:bg-white print:border-slate-500">
          <div className="text-xs font-extrabold neuro-accent-text uppercase tracking-wider mb-2 text-center print:text-black">
            Caixa de Palavras de Apoio:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {wordBank.map((word, idx) => {
              const wordStr = typeof word === 'string' ? word : String((word as any)?.text || word || '');
              return (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border-[1.5px] border-slate-400 rounded-lg font-bold text-xs sm:text-sm text-slate-900 shadow-2xs print:border-black"
                >
                  {wordStr}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Frases com Espaços */}
      <div className="space-y-3 pt-1">
        {sentencesWithBlanks.map((sentence, idx) => {
          const sentenceStr = typeof sentence === 'string'
            ? sentence
            : typeof sentence === 'object' && sentence !== null
            ? String((sentence as any).sentence || (sentence as any).text || '')
            : String(sentence ?? '');
          const hasLetterPrefix = /^[a-z]\)/i.test(sentenceStr.trim());
          const parts = sentenceStr.split(/_{2,}|\.{3,}/g);

          return (
            <div key={idx} className={`leading-[1.9] zorzi-typography ${fontSizeClass}`}>
              {!hasLetterPrefix && (
                <span className="font-extrabold neuro-accent-text mr-1.5 print:text-black">
                  {String.fromCharCode(97 + idx)})
                </span>
              )}
              {parts.map((part, pIdx) => (
                <React.Fragment key={pIdx}>
                  <span>{part}</span>
                  {pIdx < parts.length - 1 && (
                    <span className="inline-block min-w-[110px] border-b-[1.5px] border-slate-700 mx-1 relative top-[2px] print:border-black" />
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
