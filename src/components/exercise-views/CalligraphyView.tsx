import React from 'react';
import { Exercise } from '../../types/worksheet';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
}

/**
 * Norma Secção 5.C: Pauta Caligráfica Tripla (Céu 28% · Relva 44% · Terra 28%)
 * Linha de base a preto retinto e fio mínimo de 1.2pt (#475569) para fotocopiadoras.
 */
export const CalligraphyView: React.FC<Props> = ({ exercise }) => {
  const content = exercise?.content || {};
  const sampleText = typeof content.sampleText === 'string' ? content.sampleText : 'O sol brilha na Ria Formosa.';
  const lineCount = Number(content.lineCount) || 3;
  const lines = Array.from({ length: Math.max(Math.min(lineCount, 8), 2) });

  return (
    <div className="space-y-3">
      {/* Frase Modelo */}
      {sampleText && (
        <div className="p-3 neuro-surface-box rounded-lg border-[1.5px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold neuro-accent-text uppercase tracking-wider">
              Modelo de Escrita (Céu · Relva · Terra):
            </span>
            <span className="text-[10px] text-slate-600 font-medium">
              Pega "Bico do Pato" ✏️
            </span>
          </div>
          <div className="font-handwriting text-2xl sm:text-3xl font-bold tracking-wide leading-snug">
            {sampleText}
          </div>
        </div>
      )}

      {/* Pautas Escolares Triplas Portuguesas (Céu 28% · Relva 44% · Terra 28%) */}
      <div className="space-y-3 pt-1">
        {lines.map((_, idx) => (
          <div key={idx} className="pauta-tripla-portuguesa rounded-xs overflow-hidden">
            <div className="pauta-tripla-ceu" title="Céu (28% - hastes ascendentes: b, d, f, h, k, l, t)" />
            <div className="pauta-tripla-relva" title="Relva (44% - corpo central das vogais e letras)" />
            <div className="pauta-tripla-terra" title="Terra (28% - hastes descendentes: g, j, p, q, z)" />
          </div>
        ))}
      </div>
    </div>
  );
};
