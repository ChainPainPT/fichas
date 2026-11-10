import React from 'react';
import { Exercise } from '../../types/worksheet';
import { CroppedPdfFigure } from './CroppedPdfFigure';

interface Props {
  exercise: Exercise;
  fontSizeClass: string;
  documentPages?: string[];
}

/**
 * Renderiza atividades de Observação Científica / Esquema Visual Original + Explicação Causa-Efeito
 * (ex: Questão 4 da Ficha de Estudo do Meio - A Encruzilhada da Faringe e o Papel da Epiglote).
 * Preserva a imagem recortada diretamente do PDF original ao lado da caixa de escrita estruturada.
 */
export const VisualObservationView: React.FC<Props> = ({
  exercise,
  fontSizeClass,
  documentPages = []
}) => {
  const content = exercise?.content || {};
  const linesCount = Number(content.responseLinesCount) || 3;
  const heading =
    content.observationHeading || '✏️ A tua explicação científica (Causa e Efeito):';

  return (
    <div className="space-y-3">
      {content.contextText && (
        <p className={`zorzi-typography text-slate-800 print:text-black ${fontSizeClass}`}>
          {String(content.contextText)}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Coluna Esquerda: Ilustração / Esquema Original Recortado do Documento */}
        <div className="md:col-span-6 flex flex-col justify-center">
          <CroppedPdfFigure
            figureCrop={content.figureCrop}
            documentPages={documentPages}
            alt={exercise.title}
          />
        </div>

        {/* Coluna Direita: Explicação Científica + Estrutura de Apoio + Linhas de Escrita */}
        <div className="md:col-span-6 rounded-xl border-[1.5px] neuro-surface-box p-3.5 flex flex-col justify-between space-y-3 print:bg-white print:border-slate-800">
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm neuro-accent-text print:text-black">
              {heading}
            </h4>

            {content.scaffoldPrompt && (
              <div className="p-2.5 rounded-lg border border-emerald-300/80 bg-emerald-50/60 text-xs text-slate-800 leading-relaxed print:bg-white print:border-slate-700 print:text-black">
                <strong className="neuro-accent-text print:text-black">Estrutura de apoio: </strong>
                <span className="italic">{String(content.scaffoldPrompt)}</span>
              </div>
            )}
          </div>

          <div className="space-y-1 pt-1">
            {Array.from({ length: linesCount }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-[32px] border-b-[1.5px] border-dotted border-slate-500 print:border-black"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
