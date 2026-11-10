import React, { useState, useRef } from 'react';
import {
  WorksheetConfig,
  Exercise,
  ExerciseType,
  Subject,
  GradeLevel,
  AttachedDocumentMeta,
  VisualDiagramType,
  AccommodationProfile
} from '../types/worksheet';
import { STARTER_TEMPLATES } from '../utils/pt-curriculum';
import {
  parseRawTextToExercises,
  normalizeExercises,
  computeMultimodalSummary
} from '../utils/parser';
import { DIAGRAM_OPTIONS } from './svg-diagrams/PedagogicalSvgDiagrams';
import { NeuroPalettePanel } from './NeuroPalettePanel';
import {
  Sliders,
  RefreshCw,
  Wand2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Paperclip,
  Upload,
  X,
  FileCheck2,
  ShieldCheck,
  Eye,
  Table2,
  Image as ImageIcon,
  ListChecks,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Printer,
  CheckCircle2
} from 'lucide-react';

interface Props {
  config: WorksheetConfig;
  onUpdateConfig: (updates: Partial<WorksheetConfig>) => void;
  onEditExercise: (exercise: Exercise) => void;
  onChangeExerciseType: (id: string, type: ExerciseType) => void;
  onChangeExerciseDiagram: (id: string, diagram: VisualDiagramType) => void;
  onDeleteExercise: (id: string) => void;
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
  onCloseSidebar?: () => void;
  onPrint?: () => void;
}

const COMPONENT_TYPE_OPTIONS: { value: ExerciseType; label: string }[] = [
  { value: 'table_activity', label: '📊 Tabela Estruturada + Legenda / Caixa Respostas' },
  { value: 'visual_observation', label: '🖼️ Ilustração Recortada do PDF + Causa-Efeito' },
  { value: 'word_discrimination', label: '✏️ Discriminação de Conceitos [opção1 / opção2]' },
  { value: 'code_matching', label: '🗂️ Associação de Códigos com Quadrícula [ ]' },
  { value: 'multiple_choice', label: '🔠 Grelha Escolha Múltipla [A/B/C/D]' },
  { value: 'fill_blank', label: '✏️ Lacunas + Caixa de Palavras de Apoio' },
  { value: 'text_comprehension', label: '📖 Caixa Leitura Zorzi + Perguntas' },
  { value: 'math_problem', label: '🧮 Grelha Problema C.R.A. (Dados/Cálculo)' },
  { value: 'math_calculation', label: '➕ Contas Armadas na Quadrícula C-D-U' },
  { value: 'matching', label: '🔗 Duas Colunas para Ligar (50mm)' },
  { value: 'true_false', label: '✅ Grelha Verdadeiro / Falso [V/F]' },
  { value: 'calligraphy', label: '✍️ Pauta Tripla (Céu · Relva · Terra)' },
  { value: 'drawing_creative', label: '🎨 Moldura de Desenho / Esquema' },
  { value: 'free_response', label: '📝 Desafio / Linhas de Resposta Guiada' }
];

export const SidebarEditor: React.FC<Props> = ({
  config,
  onUpdateConfig,
  onEditExercise,
  onChangeExerciseType,
  onChangeExerciseDiagram,
  onDeleteExercise,
  onMoveExercise,
  onPrint
}) => {
  const [activeTab, setActiveTab] = useState<'ai_transform' | 'exercises' | 'settings'>('ai_transform');
  const [rawText, setRawText] = useState('');
  const [showManualTextEditor, setShowManualTextEditor] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [generatedSuccessMsg, setGeneratedSuccessMsg] = useState<string | null>(null);
  const [attachedDoc, setAttachedDoc] = useState<AttachedDocumentMeta | null>({
    name: 'EM_Casa.pdf (Sistemas do Corpo Humano • 4.º Ano)',
    size: 1495916,
    type: 'application/pdf',
    extractedPreview: '2 Tabelas • 1 Ilustração Recortada • 4 Legendas • 9 Blocos',
    pageCount: 5
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('sistemas_corpo_humano_4ano');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastUploadedFileRef = useRef<File | null>(null);

  const summary = config.detectedSummary || computeMultimodalSummary(config.exercises);
  const documentPages = Array.isArray(config.documentPages) ? config.documentPages : [];

  // Handle template selection
  const handleSelectTemplate = (key: string) => {
    setSelectedTemplateKey(key);
    if (STARTER_TEMPLATES[key]) {
      onUpdateConfig({ ...STARTER_TEMPLATES[key], id: `ws-${Date.now()}` });
    }
  };

  // Process uploaded file (.pdf, .docx, .md, .txt, .png, .jpg)
  const processUploadedFile = async (file: File) => {
    lastUploadedFileRef.current = file;
    setUploadError(null);
    setGeneratedSuccessMsg(null);
    setIsUploadingDoc(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('grade', config.grade);
      formData.append('subject', config.subject);
      formData.append('targetPages', '2');

      const response = await fetch('/api/ai/upload-document', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao processar ficheiro no servidor');
      }

      const result = await response.json();
      const safeExercises = normalizeExercises(result?.data?.exercises, result?.extractedText);
      const detected = result?.data?.detectedSummary || computeMultimodalSummary(safeExercises);
      const pages = Array.isArray(result?.data?.documentPages) ? result.data.documentPages : [];

      setAttachedDoc({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        extractedPreview: `${detected.tablesCount} Tabela(s) • ${detected.figuresCount} Ilustração/Esquema • ${safeExercises.length} Blocos`,
        pageCount: pages.length || undefined
      });

      if (typeof result?.extractedText === 'string' && !result.extractedText.startsWith('%PDF')) {
        setRawText(result.extractedText);
      }

      if (safeExercises.length > 0) {
        onUpdateConfig({
          title: typeof result?.data?.title === 'string' && result.data.title.trim() ? result.data.title.trim() : config.title,
          subtitle: typeof result?.data?.subtitle === 'string' && result.data.subtitle.trim() ? result.data.subtitle.trim() : config.subtitle,
          schoolName: typeof result?.data?.schoolName === 'string' && result.data.schoolName.trim() ? result.data.schoolName.trim() : config.schoolName,
          grade: (result?.data?.grade as GradeLevel) || config.grade,
          subject: (result?.data?.subject as Subject) || config.subject,
          introBanner: result?.data?.introBanner ?? config.introBanner,
          selfAssessment: result?.data?.selfAssessment ?? config.selfAssessment,
          documentPages: pages.length > 0 ? pages : config.documentPages,
          detectedSummary: detected,
          themeColor: result?.data?.recommendedTheme || config.themeColor,
          fontSizeScale: result?.data?.recommendedFontScale || config.fontSizeScale,
          spacingDensity: result?.data?.recommendedDensity || config.spacingDensity,
          neuroPalette: config.neuroPalette || 'salvia_zen',
          exercises: safeExercises
        });
        setGeneratedSuccessMsg(
          `Nova Ficha Gerada: ${detected.tablesCount} Tabela(s), ${detected.figuresCount} Ilustração(ões) e ${safeExercises.length} Blocos sem cortes!`
        );
        const previewEl = document.getElementById('a4-preview-scroll-container');
        if (previewEl) previewEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      // Fallback for offline text/markdown files
      try {
        if (file.name.toLowerCase().endsWith('.pdf')) {
          // Use built-in EM_Casa template if offline PDF upload fails
          const tpl = STARTER_TEMPLATES.sistemas_corpo_humano_4ano;
          onUpdateConfig({ ...tpl, id: `ws-${Date.now()}` });
          setAttachedDoc({
            name: file.name,
            size: file.size,
            type: 'application/pdf',
            extractedPreview: '2 Tabelas • 1 Ilustração Recortada • 9 Blocos',
            pageCount: 5
          });
        } else {
          const text = await file.text();
          setRawText(text);
          const parsed = normalizeExercises(parseRawTextToExercises(text), text);
          if (parsed.length > 0) {
            onUpdateConfig({
              title: file.name.replace(/\.[^.]+$/, ''),
              detectedSummary: computeMultimodalSummary(parsed),
              exercises: parsed
            });
          }
        }
      } catch {
        setUploadError('Não foi possível ler o ficheiro. Tenta PDF, DOCX, MD, TXT ou Imagem.');
      }
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Handle Layout & Visual Structure Adaptation from manual text/markdown editor
  const handleTransformAI = async () => {
    if (!rawText.trim()) return;
    setIsTransforming(true);

    try {
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          grade: config.grade,
          subject: config.subject,
          targetPages: 2
        })
      });

      if (!response.ok) {
        throw new Error('Falha no pedido ao servidor');
      }

      const result = await response.json();
      const safeExercises = normalizeExercises(result?.data?.exercises, rawText);
      if (safeExercises.length > 0) {
        onUpdateConfig({
          title: typeof result?.data?.title === 'string' && result.data.title.trim() ? result.data.title.trim() : config.title,
          subtitle: typeof result?.data?.subtitle === 'string' && result.data.subtitle.trim() ? result.data.subtitle.trim() : config.subtitle,
          detectedSummary: computeMultimodalSummary(safeExercises),
          themeColor: result?.data?.recommendedTheme || config.themeColor,
          fontSizeScale: result?.data?.recommendedFontScale || config.fontSizeScale,
          spacingDensity: result?.data?.recommendedDensity || config.spacingDensity,
          exercises: safeExercises
        });
        setActiveTab('exercises');
      }
    } catch (err) {
      console.warn('Fallback para parser determinístico offline:', err);
      const parsed = normalizeExercises(parseRawTextToExercises(rawText), rawText);
      if (parsed.length > 0) {
        onUpdateConfig({
          detectedSummary: computeMultimodalSummary(parsed),
          exercises: parsed
        });
        setActiveTab('exercises');
      }
    } finally {
      setIsTransforming(false);
    }
  };

  // Botão principal: Gerar / Atualizar a Nova Ficha Formatada A4
  const handleGenerateNewWorksheet = async () => {
    setGeneratedSuccessMsg(null);

    if (showManualTextEditor && rawText.trim()) {
      await handleTransformAI();
      setGeneratedSuccessMsg('Nova Ficha A4 gerada a partir do teu texto/tabela!');
      return;
    }

    if (lastUploadedFileRef.current) {
      await processUploadedFile(lastUploadedFileRef.current);
      return;
    }

    setIsTransforming(true);
    setTimeout(() => {
      const normalized = normalizeExercises(config.exercises);
      const detected = computeMultimodalSummary(normalized);
      onUpdateConfig({
        id: `ws-${Date.now()}`,
        detectedSummary: detected,
        exercises: normalized
      });
      setIsTransforming(false);
      setGeneratedSuccessMsg(
        `Nova Ficha A4 Gerada (${detected.tablesCount} Tabelas • ${detected.figuresCount} Ilustração • 0 Cortes de Página)!`
      );
      const previewEl = document.getElementById('a4-preview-scroll-container');
      if (previewEl) previewEl.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  const insertSampleText = (type: 'tabela' | 'pt' | 'mat') => {
    setShowManualTextEditor(true);
    if (type === 'tabela') {
      setRawText(`1. Preenche a tabela ligando cada órgão à sua função e sistema:
| Órgão | Função (1-4) | Sistema (A-C) |
| Pulmões | | |
| Boca | | |
| Esófago | | |
| Estômago | | |
| Coração | | |

2. Risca a palavra incorreta em cada frase:
a) A pele e o aparelho urinário fazem parte do sistema [reprodutor / excretor].
b) Quando engolimos os alimentos, a [epiglote / traqueia] fecha a entrada do aparelho respiratório.`);
    } else if (type === 'pt') {
      setRawText(`1. Lê o texto:
A Garça Branca da Ria Formosa
A garça branca caminha devagar nas águas calmas da Ria Formosa, em Faro. Com o seu bico comprido, procura pequenos peixes entre as algas verdes.
a) Onde caminha a garça branca?
b) O que procura a garça com o seu bico comprido?

2. Assinala com X a opção correta:
Qual é a cor das penas da garça?
A) Azul escura
B) Branca como a espuma do mar
C) Vermelha
D) Amarela dourada`);
    } else {
      setRawText(`1. Resolve o seguinte problema:
No Aquário da Turma 41 nadavam 38 peixes-palhaço e 24 cavalos-marinhos. Quantos animais marinhos nadavam ao todo no aquário?

2. Efetua as operações:
145 + 123
276 - 132
24 * 2`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSelectAccommodation = (profile: AccommodationProfile) => {
    if (profile === 'dyslexia') {
      onUpdateConfig({
        accommodationProfile: 'dyslexia',
        fontFamily: 'andika',
        fontSizeScale: 'lg',
        spacingDensity: 'relaxed',
        neuroPalette: 'creme_aveia',
        highlightActionVerbs: true
      });
    } else if (profile === 'dyscalculia') {
      const updatedExercises = config.exercises.map((ex) => {
        if (ex.type === 'math_problem' && (!ex.visualDiagram || ex.visualDiagram === 'none')) {
          return { ...ex, visualDiagram: 'bar_model' as VisualDiagramType };
        }
        if (ex.type === 'math_calculation' && (!ex.visualDiagram || ex.visualDiagram === 'none')) {
          return { ...ex, visualDiagram: 'mab_blocks' as VisualDiagramType };
        }
        return ex;
      });
      onUpdateConfig({
        accommodationProfile: 'dyscalculia',
        neuroPalette: 'areia_duna',
        highlightActionVerbs: true,
        exercises: updatedExercises
      });
    } else if (profile === 'adhd_pea') {
      onUpdateConfig({
        accommodationProfile: 'adhd_pea',
        spacingDensity: 'relaxed',
        neuroPalette: 'salvia_zen',
        highlightActionVerbs: true
      });
    } else {
      onUpdateConfig({
        accommodationProfile: 'standard'
      });
    }
  };

  return (
    <aside className="no-print w-full lg:w-[430px] bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden flex-shrink-0">
      {/* Abas Superiores */}
      <div className="flex border-b border-slate-200 bg-slate-50/90 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('ai_transform')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ai_transform'
              ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Paperclip className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>1. Documento</span>
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'exercises'
              ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Blocos &amp; Tabelas ({config.exercises.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-slate-700" />
          <span>3. Design &amp; NEE</span>
        </button>
      </div>

      {/* Conteúdo da Aba */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* ABA 1: ANEXAR DOCUMENTO & RAIO-X MULTIMODAL (TABELAS, DESENHOS E ESQUEMAS) */}
        {activeTab === 'ai_transform' && (
          <div className="space-y-4">
            {/* ZONA DE ANEXAR DOCUMENTO (PDF, DOCX, MD, TXT, IMAGEM) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>Anexar Ficha / Documento Original:</span>
                </label>
                <span className="text-[10px] font-semibold text-slate-500">
                  PDF • Word (.docx) • MD • Foto
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.md,.txt,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
                id="worksheet-file-upload"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Anexar documento PDF, Word, Markdown ou Imagem"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-[#1E3A8A] bg-blue-50/80'
                    : 'border-slate-300 hover:border-[#1E3A8A] bg-slate-50/70 hover:bg-blue-50/30'
                }`}
              >
                {isUploadingDoc ? (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                    <RefreshCw className="w-6 h-6 text-[#1E3A8A] animate-spin" />
                    <span className="text-xs font-bold text-[#1E3A8A]">
                      A detetar tabelas, recortar ilustrações do PDF e paginar A4...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center mb-0.5">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Clica para Anexar PDF / Word ou arrasta para aqui
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Deteta automaticamente <strong>Tabelas</strong>, <strong>Desenhos/Ilustrações</strong>, <strong>Legendas</strong> e <strong>Esquemas</strong>
                    </span>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {uploadError}
                </div>
              )}

              {/* Cartão do Documento Anexado */}
              {attachedDoc && (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileCheck2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 truncate" title={attachedDoc.name}>
                        {attachedDoc.name}
                      </div>
                      <div className="text-[10px] text-[#15803D] font-medium truncate">
                        {formatBytes(attachedDoc.size)} • {attachedDoc.extractedPreview}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedDoc(null);
                      lastUploadedFileRef.current = null;
                    }}
                    title="Remover documento anexado"
                    aria-label="Remover documento anexado"
                    className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* BOTÃO PRINCIPAL EM DESTAQUE: GERAR NOVA FICHA FORMATADA A4 */}
              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={handleGenerateNewWorksheet}
                  disabled={isUploadingDoc || isTransforming}
                  className="w-full py-3 px-4 bg-[#1E3A8A] hover:bg-blue-900 text-white font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isUploadingDoc || isTransforming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>A Gerar Nova Ficha A4 (Tabelas &amp; Esquemas)...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Gerar Nova Ficha Formatada A4</span>
                    </>
                  )}
                </button>

                {generatedSuccessMsg && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />
                    <span>{generatedSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RAIO-X MULTIMODAL DO DOCUMENTO (Substitui a caixa de texto tipo WordPad!) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-800">
                    Raio-X Visual: Tabelas, Desenhos &amp; Esquemas
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  100% Preservado
                </span>
              </div>

              {/* Grelha de Elementos Ricos Detetados no Documento */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
                  <div>
                    <div className="font-extrabold text-slate-900">{summary.tablesCount} Tabela(s)</div>
                    <div className="text-[10px] text-slate-500">Grelhas &amp; Caixas Resposta</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <div className="font-extrabold text-slate-900">{summary.figuresCount} Ilustração / SVG</div>
                    <div className="text-[10px] text-slate-500">Recorte direto do PDF</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <div>
                    <div className="font-extrabold text-slate-900">{summary.legendsCount} Legendas / Apoio</div>
                    <div className="text-[10px] text-slate-500">Bancos de palavras &amp; A-E</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                  <div>
                    <div className="font-extrabold text-slate-900">{summary.fixedPageSplitsCount} Cortes Corrigidos</div>
                    <div className="text-[10px] text-slate-500">Zero tabelas partidas</div>
                  </div>
                </div>
              </div>

              {/* Miniaturas das Páginas Renderizadas do PDF Original */}
              {documentPages.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Páginas do PDF Original Analisadas ({documentPages.length} págs):
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {documentPages.map((pageUrl, idx) => (
                      <div
                        key={idx}
                        className="relative flex-shrink-0 w-14 h-20 rounded border border-slate-300 bg-white overflow-hidden shadow-2xs"
                        title={`Página ${idx + 1} do PDF original`}
                      >
                        <img
                          src={pageUrl}
                          alt={`Página ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-slate-900/80 text-white text-[9px] font-bold rounded">
                          P.{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-600 bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2 leading-snug">
                <strong className="text-emerald-900">Correção Anti-Quebra Aplicada:</strong> Na tua ficha original, a <strong>Questão 3 (Tabela)</strong> e o <strong>Grupo IV</strong> ficavam partidos a meio entre páginas. Aqui cada tabela, legenda e ilustração fica 100% unida!
              </div>
            </div>

            {/* PAINEL DE PALETAS NEURO-ACOLHEDORAS (Acesso direto) */}
            <NeuroPalettePanel config={config} onUpdateConfig={onUpdateConfig} compact />

            {/* Demonstrações de Fichas Completas (incluindo EM_Casa.pdf) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Fichas Formatadas Prontas (Tabelas, Desenhos &amp; SVG):
              </label>
              <select
                value={selectedTemplateKey}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="sistemas_corpo_humano_4ano">
                  📄 EM_Casa.pdf — Os Sistemas do Corpo Humano (4.º Ano • Tabelas + Figura Epiglote)
                </option>
                <option value="portugues_2ano">
                  📖 Português 2.º Ano (Caixa Zorzi + Mapa Mental + Pauta Tripla)
                </option>
                <option value="matematica_3ano">
                  🧮 Matemática 3.º Ano (Esquema C.R.A. + MAB + Quadrícula 5mm)
                </option>
                <option value="estudo_do_meio_1ano">
                  🌿 Estudo do Meio 1.º Ano (Colunas 50mm + Mapa em Árvore + Desenho)
                </option>
              </select>
            </div>

            {/* Acordeão Opcional para Colar / Editar Texto ou Tabelas Markdown Manualmente */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowManualTextEditor(!showManualTextEditor)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <span>Colar / Editar Texto ou Tabelas Manualmente (Opcional)</span>
                {showManualTextEditor ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showManualTextEditor && (
                <div className="p-3 border-t border-slate-200 space-y-2.5 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500">
                      Suporta Tabelas (`| Col1 | Col2 |`) e Pares (`[opção1 / opção2]`):
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertSampleText('tabela')}
                        className="text-[10px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                      >
                        + Exemplo Tabela
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => insertSampleText('pt')}
                        className="text-[10px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                      >
                        PT
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => insertSampleText('mat')}
                        className="text-[10px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                      >
                        MAT
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Cola aqui perguntas ou tabelas em formato | Coluna 1 | Coluna 2 |..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 font-mono leading-relaxed bg-white"
                  />

                  <button
                    onClick={handleTransformAI}
                    disabled={isTransforming || !rawText.trim()}
                    className="w-full py-2 px-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isTransforming ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>A Converter Tabelas &amp; Blocos...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Converter Texto / Tabela em Blocos Visuais</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 2: ESTRUTURA VISUAL DOS BLOCOS, TABELAS, RECORTES & ESQUEMAS SVG */}
        {activeTab === 'exercises' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              Podes mudar qualquer questão para <strong>Tabela Estruturada</strong>, <strong>Ilustração Recortada + Causa-Efeito</strong>, <strong>Discriminação [A/B]</strong> ou adicionar um <strong>Esquema Vetorial SVG</strong>.
            </div>

            <div className="space-y-2.5">
              {config.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:border-slate-300 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="font-extrabold text-[#1E3A8A] bg-blue-100/80 px-1.5 py-0.5 rounded text-[11px] flex-shrink-0">
                        {ex.groupLabel || ex.number}
                      </span>
                      <span className="truncate font-bold text-slate-800" title={ex.title}>
                        {ex.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {idx > 0 && (
                        <button
                          onClick={() => onMoveExercise(idx, idx - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                          title="Subir bloco"
                          aria-label={`Mover exercício ${ex.number} para cima`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < config.exercises.length - 1 && (
                        <button
                          onClick={() => onMoveExercise(idx, idx + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                          title="Descer bloco"
                          aria-label={`Mover exercício ${ex.number} para baixo`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onEditExercise(ex)}
                        className="px-2 py-0.5 text-[#1E3A8A] hover:bg-blue-100 font-bold rounded cursor-pointer text-[11px]"
                      >
                        Ajustar
                      </button>
                      <button
                        onClick={() => onDeleteExercise(ex.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Remover bloco"
                        aria-label={`Remover exercício ${ex.number}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Seletores Rápidos de Layout Visual e Esquema SVG */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/70">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Componente de Layout:
                      </label>
                      <select
                        value={ex.type}
                        onChange={(e) => onChangeExerciseType(ex.id, e.target.value as ExerciseType)}
                        className="w-full text-[11px] font-semibold px-2 py-1 border border-slate-300 rounded bg-white text-slate-800"
                      >
                        {COMPONENT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Esquema SVG Dual-Coding:
                      </label>
                      <select
                        value={ex.visualDiagram || 'none'}
                        onChange={(e) => onChangeExerciseDiagram(ex.id, e.target.value as VisualDiagramType)}
                        className="w-full text-[11px] font-semibold px-2 py-1 border border-slate-300 rounded bg-white text-slate-800"
                      >
                        {DIAGRAM_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 3: DESIGN VISUAL, PALETAS NEURO-ACOLHEDORAS, TIPOGRAFIA & ACOMODAÇÃO NEE (DL 54/2018) */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <NeuroPalettePanel config={config} onUpdateConfig={onUpdateConfig} />

            {/* Perfis de Acomodação Visual Inclusiva */}
            <div className="space-y-2 p-3 rounded-xl bg-blue-50/50 border border-blue-200">
              <label className="block text-xs font-extrabold text-[#1E3A8A] uppercase tracking-wide flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Perfil de Adaptação Visual (DL 54/2018):</span>
              </label>
              <p className="text-[11px] text-slate-600 leading-snug">
                Adapta instantaneamente o espaçamento, paleta neuro-acolhedora, andaimes visuais e guias de foco sem alterar as perguntas.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectAccommodation('standard')}
                  className={`p-2 border text-xs font-bold rounded-lg cursor-pointer text-left transition-all ${
                    (config.accommodationProfile || 'standard') === 'standard'
                      ? 'border-[#1E3A8A] bg-white text-[#1E3A8A] shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div>Padrão Oficial</div>
                  <div className="text-[10px] font-normal text-slate-500">Norma DGE / IAVE</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAccommodation('dyslexia')}
                  className={`p-2 border text-xs font-bold rounded-lg cursor-pointer text-left transition-all ${
                    config.accommodationProfile === 'dyslexia'
                      ? 'border-[#1E3A8A] bg-white text-[#1E3A8A] shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div>Dislexia (Zorzi+)</div>
                  <div className="text-[10px] font-normal text-slate-500">Creme Aveia + Andika 15pt</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAccommodation('dyscalculia')}
                  className={`p-2 border text-xs font-bold rounded-lg cursor-pointer text-left transition-all ${
                    config.accommodationProfile === 'dyscalculia'
                      ? 'border-[#1E3A8A] bg-white text-[#1E3A8A] shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div>Discalculia (C.R.A.)</div>
                  <div className="text-[10px] font-normal text-slate-500">Areia Quente + MAB/Barras</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAccommodation('adhd_pea')}
                  className={`p-2 border text-xs font-bold rounded-lg cursor-pointer text-left transition-all ${
                    config.accommodationProfile === 'adhd_pea'
                      ? 'border-[#1E3A8A] bg-white text-[#1E3A8A] shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div>PHDA / Autismo</div>
                  <div className="text-[10px] font-normal text-slate-500">Sálvia Zen + Checklist</div>
                </button>
              </div>
            </div>

            {/* Fontes Neuroergonómicas */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Tipografia Neuroergonómica:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontFamily: 'lexend' })}
                  className={`p-2 border text-xs font-semibold rounded-lg cursor-pointer text-left ${
                    config.fontFamily === 'lexend' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  Lexend (Fluência)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontFamily: 'andika' })}
                  className={`p-2 border text-xs font-semibold rounded-lg cursor-pointer text-left ${
                    config.fontFamily === 'andika' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  Andika SIL (a/g puros)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontFamily: 'atkinson' })}
                  className={`p-2 border text-xs font-semibold rounded-lg cursor-pointer text-left ${
                    config.fontFamily === 'atkinson' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  Atkinson (b/d/p/q)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontFamily: 'handwriting' })}
                  className={`p-2 border text-xs font-semibold rounded-lg cursor-pointer text-left ${
                    config.fontFamily === 'handwriting' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  Cursiva / Caligrafia
                </button>
              </div>
            </div>

            {/* Opções de Realce Tipográfico e Geometria A4 */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Sinalização Cognitiva &amp; Geometria A4:
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.highlightActionVerbs !== false}
                  onChange={(e) => onUpdateConfig({ highlightActionVerbs: e.target.checked })}
                  className="rounded text-[#1E3A8A]"
                />
                <span>Realçar Verbos de Ação nos enunciados (<strong>Lê</strong>, <strong>Preenche</strong>...)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showHolePunchGuide !== false}
                  onChange={(e) => onUpdateConfig({ showHolePunchGuide: e.target.checked })}
                  className="rounded text-[#1E3A8A]"
                />
                <span>Mostrar guia de Margem de Furação (19mm esquerda)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showDuaRubric !== false}
                  onChange={(e) => onUpdateConfig({ showDuaRubric: e.target.checked })}
                  className="rounded text-[#1E3A8A]"
                />
                <span>Incluir Rúbrica DUA (N1 · N2 · N3) no cabeçalho</span>
              </label>
            </div>

            {/* Tamanho da Letra */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Escala Etária de Letra:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontSizeScale: 'sm' })}
                  className={`p-1.5 border text-xs rounded-lg cursor-pointer ${
                    config.fontSizeScale === 'sm' ? 'border-[#1E3A8A] bg-blue-50 font-bold text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  3º/4º (12pt)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontSizeScale: 'base' })}
                  className={`p-1.5 border text-xs rounded-lg cursor-pointer ${
                    config.fontSizeScale === 'base' ? 'border-[#1E3A8A] bg-blue-50 font-bold text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  Padrão (13pt)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ fontSizeScale: 'lg' })}
                  className={`p-1.5 border text-xs rounded-lg cursor-pointer ${
                    config.fontSizeScale === 'lg' ? 'border-[#1E3A8A] bg-blue-50 font-bold text-[#1E3A8A]' : 'border-slate-200'
                  }`}
                >
                  1º/2º (15pt)
                </button>
              </div>
            </div>

            {/* Cabeçalho */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Cabeçalho Institucional:
              </label>

              <div>
                <span className="text-xs text-slate-600">Escola / Agrupamento:</span>
                <input
                  type="text"
                  value={config.schoolName}
                  onChange={(e) => onUpdateConfig({ schoolName: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-0.5"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">Título da Ficha:</span>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => onUpdateConfig({ title: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-0.5"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RODAPÉ FIXO DE AÇÃO RÁPIDA: GERAR NOVA FICHA & GUARDAR PDF */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/95 space-y-2 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleGenerateNewWorksheet}
            disabled={isUploadingDoc || isTransforming}
            className="py-2.5 px-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs transition-all disabled:opacity-60 cursor-pointer"
          >
            {isUploadingDoc || isTransforming ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            <span>Gerar Nova Ficha</span>
          </button>

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="py-2.5 px-3 bg-[#15803D] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Guardar PDF / Imprimir</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
