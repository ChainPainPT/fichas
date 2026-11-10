import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Renderiza atividades de Tabelas Estruturadas, Legendas de Códigos ([1..4], [A..E])
 * e Caixas de Respostas (ex: Questão 3 e Grupo I da Ficha de Estudo do Meio).
 * Mantém a legenda e a tabela unidas na mesma folha A4 (break-inside: avoid).
 */
export const TableActivityView: React.FC<Props> = ({ exercise, fontSizeClass }) => {
  const content = exercise?.content || {};
  const legendBox = content.legendBox;
  const table = content.structuredTable || {
    headers: ['Órgão / Elemento', 'Função', 'Sistema'],
    rows: [
      ['Pulmões', '', ''],
      ['Boca', '', ''],
      ['Esófago', '', ''],
      ['Estômago', '', ''],
      ['Coração', '', '']
    ]
  };
  const answerCards = Array.isArray(content.answerCards) ? content.answerCards : [];
  const sideBySide = Boolean(content.sideBySideLegendAndTable && legendBox);

  const renderLegendBox = () => {
    if (!legendBox) return null;
    const hasItems = Array.isArray(legendBox.items) && legendBox.items.length > 0;
    const hasBadges = Array.isArray(legendBox.badges) && legendBox.badges.length > 0;
    if (!hasItems && !hasBadges) return null;

    return (
      <div className="rounded-xl border-[1.5px] neuro-surface-box p-3.5 space-y-2.5 print:bg-white print:border-slate-800">
        {legendBox.title && (
          <div className="text-xs font-extrabold uppercase tracking-wider neuro-accent-text border-b pb-1.5 print:text-black print:border-slate-400">
            📌 {legendBox.title}
          </div>
        )}

        {hasItems && (
          <ul className="space-y-1.5 text-[13.5px] leading-snug">
            {legendBox.items!.map((item, idx) => (
              <li key={idx} className="font-medium text-slate-800 print:text-black">
                {String(item)}
              </li>
            ))}
          </ul>
        )}

        {hasBadges && (
          <div className={hasItems ? 'pt-2 border-t border-slate-300/70 space-y-2' : 'space-y-2'}>
            {legendBox.badgeTitle && (
              <div className="text-xs font-extrabold uppercase tracking-wider neuro-accent-text print:text-black">
                🏷️ {legendBox.badgeTitle}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {legendBox.badges!.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="px-3 py-1 rounded-lg border-[1.5px] font-bold text-xs neuro-soft-chip print:bg-white print:border-slate-800 print:text-black"
                >
                  {String(badge)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTable = () => (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-slate-400 print:border-slate-900 bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="neuro-surface-box border-b-[1.5px] border-slate-400 print:bg-slate-100 print:border-slate-900">
            {(table.headers || []).map((hdr, hIdx) => (
              <th
                key={hIdx}
                className={`py-2.5 px-3 font-extrabold text-[13.5px] neuro-accent-text print:text-black ${
                  hIdx > 0 ? 'border-l border-slate-300 print:border-slate-800' : ''
                } ${hIdx > 0 && table.headers.length >= 3 ? 'text-center' : ''}`}
              >
                {String(hdr)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(table.rows || []).map((row, rIdx) => (
            <tr
              key={rIdx}
              className="border-b border-slate-300 last:border-b-0 print:border-slate-800"
            >
              {(Array.isArray(row) ? row : [String(row)]).map((cell, cIdx) => {
                const isBlankCell = !String(cell).trim();
                return (
                  <td
                    key={cIdx}
                    className={`py-2.5 px-2.5 align-middle ${fontSizeClass} ${
                      cIdx > 0 ? 'border-l border-slate-300 print:border-slate-800' : ''
                    } ${cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-800'} ${
                      isBlankCell ? 'min-w-[58px] h-10 bg-white' : ''
                    }`}
                  >
                    {String(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-3.5">
      {/* Contexto / Narrativa da Questão se existir */}
      {content.contextText && (
        <p className={`zorzi-typography text-slate-800 print:text-black ${fontSizeClass}`}>
          {String(content.contextText)}
        </p>
      )}

      {/* Layout Lado-a-Lado (ex: Questão 3) ou Empilhado (ex: Grupo I) */}
      {sideBySide ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
          <div className="md:col-span-6 flex flex-col justify-between">{renderLegendBox()}</div>
          <div className="md:col-span-6">{renderTable()}</div>
        </div>
      ) : (
        <div className="space-y-3">
          {renderLegendBox()}
          {renderTable()}
        </div>
      )}

      {/* Caixa de Respostas Estruturada (ex: Grupo I - 5 Cartões com Função [ ] e Sistema [ ]) */}
      {answerCards.length > 0 && (
        <div className="rounded-xl border-[1.5px] neuro-surface-box p-3.5 space-y-2.5 print:bg-white print:border-slate-900">
          <div className="text-xs font-extrabold text-center uppercase tracking-wider neuro-accent-text print:text-black">
            📦 Caixa de Respostas (Indica o N.º da Função e a Letra do Sistema):
          </div>
          <div
            className="grid gap-2.5"
            style={{
              gridTemplateColumns: `repeat(${Math.min(answerCards.length, 5)}, minmax(0, 1fr))`
            }}
          >
            {answerCards.map((card, cIdx) => (
              <div
                key={cIdx}
                className="p-2.5 rounded-lg border border-slate-300 bg-white/95 print:bg-white print:border-slate-800 flex flex-col items-center space-y-2"
              >
                <div className="font-extrabold text-xs text-slate-900 text-center">
                  {String(card.title)}
                </div>
                {(card.fields || ['Função:', 'Sistema:']).map((fieldLabel, fIdx) => (
                  <div
                    key={fIdx}
                    className="w-full flex items-center justify-between gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    <span>{String(fieldLabel)}</span>
                    <span className="w-8 h-6 rounded border-[1.5px] border-slate-600 bg-white inline-block flex-shrink-0 print:border-black" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
