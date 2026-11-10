import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Norma Secção 2.C:
 * - Entrelinha 1.5 a 1.65, letter-spacing +0.05em, word-spacing +0.15em
 * - Measure: máximo 50 a 65 caracteres por linha (max-w-[64ch])
 * - Sempre alinhado à esquerda (nunca justificado)
 * - Linhas de resposta com 10mm a 12mm de altura e cor #475569 (1.2pt+)
 */
export const TextComprehensionView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const readingTitle = typeof content.readingTitle === 'string' ? content.readingTitle : '';
  const readingAuthor = typeof content.readingAuthor === 'string' ? content.readingAuthor : '';
  const readingText = typeof content.readingText === 'string' ? content.readingText : '';
  const subQuestions = Array.isArray(content.subQuestions) ? content.subQuestions : [];

  return (
    <div className="space-y-4">
      {/* Caixa de Texto de Leitura (Superfície Neuro-Acolhedora Suave e Medida 64ch) */}
      {(readingText || readingTitle) && (
        <div className="neuro-surface-box border-[1.5px] rounded-lg p-4">
          {readingTitle && (
            <h4 className="font-bold neuro-accent-text mb-2 text-base sm:text-lg tracking-wide">
              {readingTitle}
            </h4>
          )}
          {readingText && (
            <div className={`whitespace-pre-line zorzi-typography max-w-[64ch] ${fontSizeClass}`}>
              {readingText}
            </div>
          )}
          {readingAuthor && (
            <div className="text-right text-xs text-slate-600 mt-2.5 font-semibold">
              — {readingAuthor}
            </div>
          )}
        </div>
      )}

      {/* Perguntas de Compreensão com Linhas Musculares de 10-12mm */}
      {subQuestions.length > 0 && (
        <div className="space-y-3.5 mt-2">
          {subQuestions.map((q, idx) => {
            const qStr = typeof q === 'string'
              ? q
              : typeof q === 'object' && q !== null
              ? String((q as any).question || (q as any).text || '')
              : String(q ?? '');
            return (
              <div key={idx} className="space-y-1">
                <div className={`font-semibold flex items-start gap-2 zorzi-typography ${fontSizeClass}`}>
                  <span className="neuro-accent-text print:text-black font-bold">{String.fromCharCode(97 + idx)})</span>
                  <span>{qStr}</span>
                </div>
                <div className="pt-1 space-y-1">
                  <div className="h-9 border-b-[1.5px] border-slate-600 print-ink-line w-full" />
                  <div className="h-9 border-b-[1.5px] border-slate-600 print-ink-line w-full" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
