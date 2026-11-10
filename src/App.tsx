import React, { useState, useEffect } from 'react';
import { WorksheetConfig, Exercise, ExerciseType, VisualDiagramType } from './types/worksheet';
import { STARTER_TEMPLATES } from './utils/pt-curriculum';
import { normalizeExercises, computeMultimodalSummary } from './utils/parser';
import { PrintBudgetBar } from './components/PrintBudgetBar';
import { SidebarEditor } from './components/SidebarEditor';
import { WorksheetPreview } from './components/WorksheetPreview';
import { ExerciseEditorModal } from './components/ExerciseEditorModal';
import { PanelLeftOpen, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'fichacriativa_layout_state_v4';

interface ErrorBoundaryProps {
  onReset: () => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class PreviewErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md text-center space-y-3">
          <h2 className="text-base font-bold text-slate-800">
            A recuperar a estrutura visual da ficha...
          </h2>
          <p className="text-xs text-slate-600">
            Detetámos um formato inesperado num dos blocos. Clica abaixo para restaurar a folha A4.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Visualização A4</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [config, setConfig] = useState<WorksheetConfig>(() => {
    try {
      localStorage.removeItem('fichacriativa_layout_state_v1');
      localStorage.removeItem('fichacriativa_layout_state_v2');
      localStorage.removeItem('fichacriativa_layout_state_v3');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.exercises)) {
          const safeExercises = normalizeExercises(parsed.exercises);
          if (safeExercises.length > 0) {
            return {
              ...STARTER_TEMPLATES.sistemas_corpo_humano_4ano,
              ...parsed,
              neuroPalette: parsed.neuroPalette || 'salvia_zen',
              detectedSummary: parsed.detectedSummary || computeMultimodalSummary(safeExercises),
              exercises: safeExercises
            };
          }
        }
      }
    } catch {
      // ignore storage errors
    }
    return STARTER_TEMPLATES.sistemas_corpo_humano_4ano;
  });

  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    try {
      // Avoid storing huge base64 documentPages in localStorage if over quota
      const { documentPages, ...rest } = config;
      const lightPages = (documentPages || []).filter((p) => !p.startsWith('data:') || p.length < 120000);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, documentPages: lightPages }));
    } catch {
      // ignore quota errors
    }
  }, [config]);

  const handleUpdateConfig = (updates: Partial<WorksheetConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      if (updates.exercises) {
        next.exercises = normalizeExercises(updates.exercises);
        next.detectedSummary = updates.detectedSummary || computeMultimodalSummary(next.exercises);
      }
      return next;
    });
  };

  // Change visual component type of an exercise while preserving its original content
  const handleChangeExerciseType = (id: string, newType: ExerciseType) => {
    setConfig((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== id) return ex;
        const safeContent = ex.content || {};
        const rawTextFallback =
          safeContent.contextText ||
          safeContent.readingText ||
          safeContent.problemPrompt ||
          safeContent.questionPrompt ||
          safeContent.question ||
          safeContent.sampleText ||
          safeContent.drawingPrompt ||
          ex.title;

        return {
          ...ex,
          type: newType,
          content: {
            ...safeContent,
            readingText: safeContent.readingText || rawTextFallback,
            problemPrompt: safeContent.problemPrompt || rawTextFallback,
            questionPrompt: safeContent.questionPrompt || rawTextFallback,
            question: safeContent.question || rawTextFallback,
            sampleText: safeContent.sampleText || rawTextFallback,
            drawingPrompt: safeContent.drawingPrompt || rawTextFallback,
            responseLinesCount: safeContent.responseLinesCount || 2,
            lineCount: safeContent.lineCount || 2
          }
        };
      })
    }));
  };

  const handleChangeExerciseDiagram = (id: string, diagram: VisualDiagramType) => {
    setConfig((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, visualDiagram: diagram } : ex
      )
    }));
  };

  const handleDeleteExercise = (id: string) => {
    setConfig((prev) => {
      const remaining = prev.exercises.filter((ex) => ex.id !== id);
      const renumbered = remaining.map((ex, idx) => ({
        ...ex,
        number: `${idx + 1}.`
      }));
      return {
        ...prev,
        detectedSummary: computeMultimodalSummary(renumbered),
        exercises: renumbered
      };
    });
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const handleSaveExercise = (updated: Exercise) => {
    setConfig((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => (ex.id === updated.id ? updated : ex))
    }));
  };

  const handleMoveExercise = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= config.exercises.length) return;
    setConfig((prev) => {
      const items = [...prev.exercises];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return {
        ...prev,
        exercises: items.map((ex, idx) => ({ ...ex, number: `${idx + 1}.` }))
      };
    });
  };

  const handleTogglePageBreak = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, forcePageBreakBefore: !ex.forcePageBreakBefore } : ex
      )
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToSafeState = () => {
    setConfig(STARTER_TEMPLATES.sistemas_corpo_humano_4ano);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-lexend text-slate-900">
      <PrintBudgetBar
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onPrint={handlePrint}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            title="Abrir painel de layout e design"
            aria-label="Abrir painel de layout e design"
            className="no-print absolute top-4 left-4 z-20 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-md text-slate-800 hover:text-[#1E3A8A] cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <PanelLeftOpen className="w-4 h-4 text-[#1E3A8A]" />
            <span>Anexar &amp; Layout</span>
          </button>
        )}

        {sidebarOpen && (
          <SidebarEditor
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onEditExercise={handleEditExercise}
            onChangeExerciseType={handleChangeExerciseType}
            onChangeExerciseDiagram={handleChangeExerciseDiagram}
            onDeleteExercise={handleDeleteExercise}
            onMoveExercise={handleMoveExercise}
            onCloseSidebar={() => setSidebarOpen(false)}
            onPrint={handlePrint}
          />
        )}

        <main
          id="a4-preview-scroll-container"
          className="flex-1 overflow-y-auto px-2 sm:px-6 flex justify-center bg-slate-200/70 print:bg-white print:p-0 scroll-smooth"
        >
          <PreviewErrorBoundary onReset={handleResetToSafeState}>
            <WorksheetPreview
              config={config}
              onEditExercise={handleEditExercise}
              onDeleteExercise={handleDeleteExercise}
              onMoveUpExercise={(idx) => handleMoveExercise(idx, idx - 1)}
              onMoveDownExercise={(idx) => handleMoveExercise(idx, idx + 1)}
              onTogglePageBreak={handleTogglePageBreak}
              onChangeDiagram={handleChangeExerciseDiagram}
            />
          </PreviewErrorBoundary>
        </main>
      </div>

      <ExerciseEditorModal
        exercise={editingExercise}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExercise}
      />
    </div>
  );
}
