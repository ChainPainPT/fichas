import React from 'react';
import { WorksheetConfig, Exercise, VisualDiagramType } from '../types/worksheet';
import { WorksheetHeader } from './WorksheetHeader';
import { WorksheetFooter } from './WorksheetFooter';
import { ExerciseRenderer } from './exercise-views/ExerciseRenderer';
import { calculatePageBudget } from '../utils/print-helpers';
import { getNeuroPalette } from '../utils/neuro-palettes';
import { Compass } from 'lucide-react';

interface Props {
  config: WorksheetConfig;
  onEditExercise?: (exercise: Exercise) => void;
  onDeleteExercise?: (id: string) => void;
  onMoveUpExercise?: (index: number) => void;
  onMoveDownExercise?: (index: number) => void;
  onTogglePageBreak?: (id: string) => void;
  onChangeDiagram?: (id: string, diagram: VisualDiagramType) => void;
}

export const WorksheetPreview: React.FC<Props> = ({
  config,
  onEditExercise,
  onDeleteExercise,
  onMoveUpExercise,
  onMoveDownExercise,
  onTogglePageBreak,
  onChangeDiagram
}) => {
  const {
    exercises = [],
    spacingDensity = 'normal',
    fontSizeScale = 'base',
    themeColor = 'blue',
    neuroPalette = 'creme_aveia',
    keepSoftTintOnPrint = false,
    fontFamily = 'lexend',
    monochromePrintMode = false,
    showHolePunchGuide = true,
    accommodationProfile = 'standard',
    highlightActionVerbs = true,
    schoolName = 'Escola Básica da Lejana',
    grade = '2º Ano',
    introBanner,
    documentPages = []
  } = config || ({} as WorksheetConfig);

  const palette = getNeuroPalette(neuroPalette);

  const fontClass =
    fontFamily === 'andika' ? 'font-andika' :
    fontFamily === 'atkinson' ? 'font-atkinson' :
    fontFamily === 'nunito' ? 'font-nunito' :
    fontFamily === 'handwriting' ? 'font-handwriting' : 'font-lexend';

  const spacingClass =
    spacingDensity === 'compact' ? 'space-y-3' :
    spacingDensity === 'relaxed' || accommodationProfile === 'adhd_pea' ? 'space-y-5 sm:space-y-6' : 'space-y-4';

  const dyslexiaClass = accommodationProfile === 'dyslexia' ? 'tracking-wider leading-loose' : '';

  const activeTheme = monochromePrintMode ? 'mono' : themeColor;
  const budget = calculatePageBudget(config);
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  const neuroVars = {
    '--neuro-paper-bg': monochromePrintMode ? '#FFFFFF' : palette.paperBg,
    '--neuro-card-bg': monochromePrintMode ? '#FFFFFF' : palette.cardBg,
    '--neuro-surface-tint': monochromePrintMode ? '#F8FAFC' : palette.surfaceTint,
    '--neuro-border': monochromePrintMode ? '#1E293B' : palette.borderCalm,
    '--neuro-accent': monochromePrintMode ? '#0F172A' : palette.accentCalm,
    '--neuro-accent-soft': monochromePrintMode ? '#F1F5F9' : palette.accentSoftBg,
    '--neuro-text': monochromePrintMode ? '#000000' : palette.textPrimary,
    minHeight: '297mm',
    width: '100%',
    maxWidth: '210mm'
  } as React.CSSProperties;

  return (
    <div className="flex flex-col items-center justify-start w-full py-4 sm:py-8 overflow-x-auto">
      {/* Folha A4 Real com Paleta Neuro-Acolhedora Aplicada a Todo o Documento */}
      <div
        id="worksheet-printable-area"
        data-neuro-palette={palette.id}
        className={`a4-sheet relative shadow-xl border border-slate-300 rounded-xs ${fontClass} ${dyslexiaClass} ${
          keepSoftTintOnPrint ? 'keep-neuro-tint-print' : ''
        } ${monochromePrintMode ? 'grayscale contrast-125' : ''} transition-all duration-200`}
        style={neuroVars}
      >
        {/* Guia Visual da Zona de Segurança de Furação (19mm Esquerda - 2/4 Argolas) - Oculto na Impressão */}
        {showHolePunchGuide && (
          <div
            className="no-print absolute top-0 bottom-0 left-0 w-[18mm] border-r border-dashed border-amber-500/40 bg-amber-50/20 pointer-events-none flex flex-col items-center justify-around py-24"
            title="Zona de Segurança para Furação de Dossiê (19mm Margem Esquerda)"
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400/50 bg-slate-200/60" />
            <div className="writing-vertical text-[9px] font-mono uppercase tracking-widest text-slate-400 -rotate-90 whitespace-nowrap">
              Margem Furação (19mm)
            </div>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400/50 bg-slate-200/60" />
          </div>
        )}

        {/* Cabeçalho Escolar Oficial (DGE / IAVE / EB da Lejana) */}
        <WorksheetHeader config={{ ...config, themeColor: activeTheme }} />

        {/* Caixa Introdutória / Motivacional do Documento (ex: "Olá, pequenos exploradores!...") */}
        {introBanner && (
          <div className="my-3.5 p-3.5 rounded-xl border-[1.5px] neuro-surface-box flex items-start gap-3 print:bg-white print:border-slate-800">
            <div className="w-7 h-7 rounded-lg neuro-badge-accent flex items-center justify-center flex-shrink-0 mt-0.5 print:bg-slate-900 print:text-white">
              <Compass className="w-4 h-4" />
            </div>
            <p className="text-[14.5px] leading-relaxed zorzi-typography text-slate-800 print:text-black">
              {introBanner}
            </p>
          </div>
        )}

        {/* Lista de Exercícios Adaptativos */}
        <main className={`worksheet-exercises ${spacingClass} my-4`}>
          {safeExercises.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-400 rounded-xl my-6 bg-white/80">
              <span className="text-4xl block mb-2">📎</span>
              <h3 className="font-bold text-slate-800 text-lg">Estúdio Pronto para Formatar o Teu Documento</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                Anexa um ficheiro (PDF, Word .docx, Markdown ou Imagem) ou cola o texto para aplicar o layout e paginação A4!
              </p>
            </div>
          ) : (
            safeExercises.map((exercise, idx) => {
              const exBudget = budget.exerciseHeights[idx];
              const prevBudget = idx > 0 ? budget.exerciseHeights[idx - 1] : null;
              const isStartOfNewPage =
                exercise?.forcePageBreakBefore ||
                (exBudget && prevBudget && exBudget.startsAtPage > prevBudget.startsAtPage);
              const pageNumber = exBudget?.startsAtPage || 2;

              return (
                <React.Fragment key={exercise?.id || `ex-${idx}`}>
                  {/* Norma Secção 7.2: Barra de Continuação de 10mm na Página 2+ */}
                  {isStartOfNewPage && idx > 0 && (
                    <div
                      className={`continuation-header pt-3 pb-2 mb-3 border-b-2 border-slate-700 flex flex-wrap items-baseline justify-between gap-2 text-xs font-bold ${
                        exercise?.forcePageBreakBefore ? 'force-page-break' : ''
                      }`}
                    >
                      <span className="uppercase tracking-wide">
                        {String(schoolName || '').split('—')[0]?.trim() || 'Escola Básica da Lejana'}
                      </span>
                      <span className="flex-1 flex items-baseline gap-1.5 min-w-[180px] max-w-xs mx-2">
                        <span>• Nome:</span>
                        <span className="flex-1 border-b-[1.5px] border-slate-700 h-4 inline-block" />
                      </span>
                      <span>
                        • {grade} • Pág. {pageNumber}
                      </span>
                    </div>
                  )}

                  <ExerciseRenderer
                    exercise={{
                      ...exercise,
                      forcePageBreakBefore: isStartOfNewPage && idx > 0 ? false : exercise?.forcePageBreakBefore
                    }}
                    index={idx}
                    totalExercises={safeExercises.length}
                    fontSizeScale={fontSizeScale}
                    themeColor={activeTheme}
                    grade={grade}
                    accommodationProfile={accommodationProfile}
                    highlightActionVerbs={highlightActionVerbs}
                    documentPages={documentPages}
                    onEdit={onEditExercise}
                    onDelete={onDeleteExercise}
                    onMoveUp={onMoveUpExercise}
                    onMoveDown={onMoveDownExercise}
                    onTogglePageBreak={onTogglePageBreak}
                    onChangeDiagram={onChangeDiagram}
                  />
                </React.Fragment>
              );
            })
          )}
        </main>

        {/* Rodapé com Autoavaliação, Assinaturas e Mensagem */}
        <WorksheetFooter config={config} />
      </div>
    </div>
  );
};
