import React from 'react';
import { Exercise, GradeLevel, AccommodationProfile, VisualDiagramType } from '../../types/worksheet';
import { TextComprehensionView } from './TextComprehensionView';
import { MathProblemView } from './MathProblemView';
import { MathCalculationView } from './MathCalculationView';
import { MatchingView } from './MatchingView';
import { FillBlankView } from './FillBlankView';
import { TrueFalseView } from './TrueFalseView';
import { MultipleChoiceView } from './MultipleChoiceView';
import { CalligraphyView } from './CalligraphyView';
import { DrawingCreativeView } from './DrawingCreativeView';
import { FreeResponseView } from './FreeResponseView';
import { TableActivityView } from './TableActivityView';
import { VisualObservationView } from './VisualObservationView';
import { WordDiscriminationView } from './WordDiscriminationView';
import { CodeMatchingView } from './CodeMatchingView';
import { CroppedPdfFigure } from './CroppedPdfFigure';
import { PedagogicalSvgDiagrams } from '../svg-diagrams/PedagogicalSvgDiagrams';
import { renderWithHighlightedVerbs } from '../../utils/typography-enhancer';
import { ArrowUp, ArrowDown, Trash2, Edit3, Scissors, SplitSquareVertical, Lightbulb } from 'lucide-react';

interface Props {
  exercise: Exercise;
  index: number;
  totalExercises: number;
  fontSizeScale: 'sm' | 'base' | 'lg';
  themeColor: string;
  grade?: GradeLevel;
  accommodationProfile?: AccommodationProfile;
  highlightActionVerbs?: boolean;
  documentPages?: string[];
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (id: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onTogglePageBreak?: (id: string) => void;
  onChangeDiagram?: (id: string, diagram: VisualDiagramType) => void;
}

export const ExerciseRenderer: React.FC<Props> = ({
  exercise,
  index,
  totalExercises,
  fontSizeScale,
  themeColor,
  grade,
  accommodationProfile = 'standard',
  highlightActionVerbs = true,
  documentPages = [],
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onTogglePageBreak,
  onChangeDiagram
}) => {
  const fontSizeClass =
    fontSizeScale === 'sm' ? 'text-[14.5px]' :
    fontSizeScale === 'lg' ? 'text-[18px]' : 'text-[16px]';

  const titleSizeClass =
    fontSizeScale === 'sm' ? 'text-[15.5px]' :
    fontSizeScale === 'lg' ? 'text-[19px]' : 'text-[17px]';

  const duaTierBadge: Record<string, { label: string; colorClass: string }> = {
    N1: { label: 'DUA N1 • Apoio', colorClass: 'neuro-soft-chip' },
    N2: { label: 'DUA N2 • Consolidação', colorClass: 'neuro-soft-chip' },
    N3: { label: 'DUA N3 • Desafio', colorClass: 'neuro-soft-chip' }
  };

  const badgeClass = themeColor === 'mono' ? 'bg-slate-900 text-white' : 'neuro-badge-accent';

  const effectiveDiagram: VisualDiagramType =
    exercise.visualDiagram && exercise.visualDiagram !== 'none'
      ? exercise.visualDiagram
      : accommodationProfile === 'dyscalculia' && exercise.type === 'math_problem'
      ? 'bar_model'
      : accommodationProfile === 'dyscalculia' && exercise.type === 'math_calculation'
      ? 'mab_blocks'
      : 'none';

  const safeTitle = typeof exercise?.title === 'string' ? exercise.title : `Exercício ${exercise?.number || index + 1}`;
  const content = exercise?.content || {};

  return (
    <div
      data-no-break="true"
      className={`exercise-card exercise-avoid-break relative group border-[1.5px] rounded-xl p-4 sm:p-5 transition-all duration-150 print:border-slate-800 print:shadow-none print:p-3.5 print:rounded-lg ${
        exercise.forcePageBreakBefore ? 'force-page-break' : ''
      } ${accommodationProfile === 'dyslexia' ? 'tracking-[0.07em] leading-[1.75]' : ''}`}
    >
      {/* Indicador de quebra de página forçada no ecrã */}
      {exercise.forcePageBreakBefore && (
        <div className="no-print -mt-2 mb-3 pb-2 border-b border-dashed border-indigo-400 flex items-center justify-between text-xs text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded">
          <span className="flex items-center gap-1.5 font-semibold">
            <SplitSquareVertical className="w-3.5 h-3.5" />
            Quebra de página forçada antes deste exercício (inicia nova página com Barra de Continuação)
          </span>
          <button
            onClick={() => onTogglePageBreak?.(exercise.id)}
            className="text-indigo-700 hover:text-indigo-950 underline text-xs cursor-pointer font-semibold"
          >
            Remover quebra
          </button>
        </div>
      )}

      {/* Acomodação Visual PHDA / Autismo (PEA): Checklist de Foco Passo-a-Passo */}
      {accommodationProfile === 'adhd_pea' && (
        <div className="mb-3 pb-2 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold neuro-surface-box px-3 py-1.5 rounded print:bg-white print:border-slate-700">
          <span className="uppercase tracking-wider neuro-accent-text print:text-black">
            Guia de Foco Passo a Passo:
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 border-[1.5px] border-slate-800 inline-block bg-white" /> 1. Ler
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 border-[1.5px] border-slate-800 inline-block bg-white" /> 2. Resolver
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 border-[1.5px] border-slate-800 inline-block bg-white" /> 3. Rever
            </span>
          </div>
        </div>
      )}

      {/* Cabeçalho do Exercício: Etiqueta de Grupo (GRUPO I..IV), Número, Enunciado, Domínio e Cotação */}
      <div className="flex items-start justify-between gap-3 mb-3.5 pb-2 border-b border-slate-200/80 print:border-slate-300">
        <div className="flex items-baseline gap-2.5 flex-1">
          {exercise.groupLabel ? (
            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full font-extrabold text-xs uppercase tracking-wider flex-shrink-0 ${badgeClass} print:bg-slate-900 print:text-white`}>
              {exercise.groupLabel}
            </span>
          ) : (
            <span className={`inline-flex items-center justify-center min-w-[30px] h-7 px-2 rounded-md font-bold text-sm tracking-wide flex-shrink-0 ${badgeClass} print:bg-slate-900 print:text-white`}>
              {exercise.number}
            </span>
          )}
          <h3 className={`font-bold zorzi-typography ${titleSizeClass}`}>
            {renderWithHighlightedVerbs(safeTitle, highlightActionVerbs)}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Etiqueta de Domínio Científico / Pedagógico (ex: Compreensão Científica, Organização de Dados) */}
          {exercise.domainTag && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md border neuro-surface-box whitespace-nowrap print:border-slate-700 print:text-black">
              {exercise.domainTag}
            </span>
          )}

          {/* Etiqueta de Nível DUA (DL 54/2018) */}
          {exercise.duaTier && duaTierBadge[exercise.duaTier] && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border whitespace-nowrap print:border-slate-800 print:text-black ${duaTierBadge[exercise.duaTier].colorClass}`}>
              {duaTierBadge[exercise.duaTier].label}
            </span>
          )}

          {/* Cotação do Exercício */}
          {exercise.points && (
            <span className="text-xs font-bold px-2 py-0.5 rounded border neuro-surface-box whitespace-nowrap">
              {exercise.points}
            </span>
          )}
        </div>

        {/* Barra de Ações de Layout & Esquema SVG (flutuante ao passar o rato, oculta na impressão) */}
        <div className="no-print opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute top-2.5 right-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
          {onChangeDiagram && (
            <select
              value={exercise.visualDiagram || 'none'}
              onChange={(e) => onChangeDiagram(exercise.id, e.target.value as VisualDiagramType)}
              title="Inserir Esquema Vetorial SVG / Thinking Map neste exercício"
              aria-label={`Esquema visual do exercício ${exercise.number}`}
              className="text-[11px] font-semibold border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-700 hover:border-[#1E3A8A] cursor-pointer"
            >
              <option value="none">+ Esquema SVG</option>
              <option value="bar_model">📊 Bar Model C.R.A.</option>
              <option value="mab_blocks">🧱 Blocos MAB (C-D-U)</option>
              <option value="number_line">📏 Reta Numérica</option>
              <option value="fraction_bars">🍕 Barras de Frações</option>
              <option value="analog_clock">🕒 Relógio Analógico</option>
              <option value="thinking_map_bubble">💭 Mapa de Bolhas</option>
              <option value="thinking_map_flow">➡️ Mapa de Sequência</option>
              <option value="thinking_map_tree">🌳 Mapa de Árvore</option>
            </select>
          )}
          {onMoveUp && index > 0 && (
            <button
              onClick={() => onMoveUp(index)}
              title="Mover para cima"
              aria-label={`Mover exercício ${exercise.number} para cima`}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && index < totalExercises - 1 && (
            <button
              onClick={() => onMoveDown(index)}
              title="Mover para baixo"
              aria-label={`Mover exercício ${exercise.number} para baixo`}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
          {onTogglePageBreak && (
            <button
              onClick={() => onTogglePageBreak(exercise.id)}
              title={exercise.forcePageBreakBefore ? 'Remover quebra de página' : 'Forçar quebra de página antes deste exercício'}
              aria-label="Forçar quebra de página antes deste exercício"
              className={`p-1 rounded cursor-pointer ${
                exercise.forcePageBreakBefore ? 'text-indigo-700 bg-indigo-50' : 'text-slate-500 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(exercise)}
              title="Personalizar layout deste exercício"
              aria-label={`Editar layout do exercício ${exercise.number}`}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(exercise.id)}
              title="Eliminar exercício"
              aria-label={`Eliminar exercício ${exercise.number}`}
              className="p-1 rounded text-slate-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pista de Apoio DUA (DL 54/2018) */}
      {exercise.duaHint && (
        <div className="mb-3 flex items-center gap-2 text-xs neuro-surface-box rounded-lg px-3 py-1.5 print:bg-white print:border-slate-700">
          <Lightbulb className="w-3.5 h-3.5 neuro-accent-text flex-shrink-0 print:text-black" />
          <span>
            <strong className="font-bold">Pista DUA / Dica:</strong>{' '}
            <span className="italic">{exercise.duaHint}</span>
          </span>
        </div>
      )}

      {/* Diagrama Vetorial SVG Dual-Coding & Thinking Maps */}
      {effectiveDiagram !== 'none' && (
        <PedagogicalSvgDiagrams
          type={effectiveDiagram}
        />
      )}

      {/* Se um exercício de outro tipo tiver uma figura recortada anexa (ex: escolha múltipla com imagem), renderiza-a */}
      {exercise.type !== 'visual_observation' && content.figureCrop && (
        <div className="mb-3">
          <CroppedPdfFigure
            figureCrop={content.figureCrop}
            documentPages={documentPages}
            alt={safeTitle}
          />
        </div>
      )}

      {/* Conteúdo Específico por Tipo de Exercício */}
      <div className="pl-1 sm:pl-2">
        {exercise.type === 'text_comprehension' && (
          <TextComprehensionView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'math_problem' && (
          <MathProblemView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'math_calculation' && (
          <MathCalculationView exercise={exercise} fontSizeClass={fontSizeClass} grade={grade} />
        )}
        {exercise.type === 'matching' && (
          <MatchingView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'fill_blank' && (
          <FillBlankView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'true_false' && (
          <TrueFalseView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'multiple_choice' && (
          <MultipleChoiceView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'calligraphy' && (
          <CalligraphyView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'drawing_creative' && (
          <DrawingCreativeView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'table_activity' && (
          <TableActivityView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'visual_observation' && (
          <VisualObservationView
            exercise={exercise}
            fontSizeClass={fontSizeClass}
            documentPages={documentPages}
          />
        )}
        {exercise.type === 'word_discrimination' && (
          <WordDiscriminationView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {exercise.type === 'code_matching' && (
          <CodeMatchingView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
        {(exercise.type === 'free_response' || exercise.type === 'ordering_sequence') && (
          <FreeResponseView exercise={exercise} fontSizeClass={fontSizeClass} />
        )}
      </div>
    </div>
  );
};
