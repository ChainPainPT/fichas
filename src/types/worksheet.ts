export type GradeLevel = '1º Ano' | '2º Ano' | '3º Ano' | '4º Ano';

export type Subject = 
  | 'Português'
  | 'Matemática'
  | 'Estudo do Meio'
  | 'Inglês'
  | 'Expressões Artísticas'
  | 'Cidadania e Desenvolvimento';

export type ExerciseType =
  | 'text_comprehension'   // Texto original com perguntas e linhas de interpretação (10-12mm)
  | 'math_problem'        // Problema: Dados/Esquema C.R.A. + Operação/Cálculo + Resposta
  | 'math_calculation'    // Contas armadas com quadrícula matemática (tabular-nums)
  | 'matching'            // Ligar coluna A à coluna B com 45-55mm de espaço central
  | 'fill_blank'          // Completar lacunas (com ou sem banco de palavras)
  | 'multiple_choice'     // Escolha múltipla em grelha de 2 colunas simétricas (A/B | C/D)
  | 'true_false'          // Afirmações com caixas [ V ] [ F ] de alto contraste
  | 'calligraphy'         // Treino de escrita em pauta tripla (Céu 28% · Relva 44% · Terra 28%)
  | 'drawing_creative'    // Moldura para desenhar/pintar/esquema visual
  | 'ordering_sequence'   // Ordenar acontecimentos ou números de 1 a N
  | 'free_response'       // Resposta livre com linhas guiadas de 10-12mm
  | 'table_activity'      // Tabelas estruturadas + Legendas de códigos + Caixa de Respostas
  | 'visual_observation'  // Ilustração/Esquema original recortado do PDF + Explicação Causa-Efeito
  | 'word_discrimination' // Discriminação de conceitos (riscar a palavra incorreta em pares inline)
  | 'code_matching';      // Associação de código [A/B/C/D] com quadrícula de resposta [ ]

export type EvaluationMode = 
  | 'faces'         // Carinhas / Emojis (Excelente, Bom, A melhorar) - ideal 1º/2º ano
  | 'qualitative'   // Menção Qualitativa Oficial + Rúbrica DUA (N1, N2, N3)
  | 'percentage'    // 0% a 100%
  | 'points'        // Cotação por pontos (ex: Total: 100 pontos)
  | 'none';         // Sem caixa de avaliação

export type DuaTier = 'N1' | 'N2' | 'N3';

export type VisualDiagramType =
  | 'none'
  | 'bar_model'           // Modelo de Barras Singapura (math-cra-diagnostics)
  | 'mab_blocks'          // Material Multibásico C-D-U (svg-vector-baoyu-diagram)
  | 'number_line'         // Reta Numérica Vetorial (svg-vector-baoyu-diagram)
  | 'fraction_bars'       // Barras / Discos de Frações (svg-vector-baoyu-diagram)
  | 'analog_clock'        // Relógio Analógico para desenhar ponteiros
  | 'thinking_map_bubble' // Mapa de Bolhas / Bubble Map (thinking-maps-hand-drawn)
  | 'thinking_map_flow'   // Mapa de Fluxo / Sequência (thinking-maps-hand-drawn)
  | 'thinking_map_tree';  // Mapa de Árvore / Classificação (thinking-maps-hand-drawn)

export type AccommodationProfile =
  | 'standard'     // Layout Padrão Oficial (DGE / IAVE / EB da Lejana)
  | 'dyslexia'     // Acomodação Visual Dislexia (Andika/Lexend, tracking ampliado, verbos a negrito)
  | 'adhd_pea'     // Acomodação Visual PHDA / Autismo (Checkboxes de foco passo-a-passo, zero ruído)
  | 'dyscalculia'; // Acomodação Visual Discalculia (Grelha posicional C-D-U 7mm + Bar Model C.R.A.)

export type NeuroPaletteId =
  | 'creme_aveia'
  | 'salvia_zen'
  | 'areia_duna'
  | 'nevoeiro_nordico'
  | 'lavanda_serena'
  | 'algodao_neutro';

export interface ExerciseItem {
  id: string;
  label: string;
  sublabel?: string;
  expectedAnswer?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MathCalculationItem {
  operation: string;
  vertical?: boolean;
  term1?: string;
  operator?: '+' | '-' | 'x' | '×' | ':' | '/';
  term2?: string;
  showGrid?: boolean;
}

export interface StructuredTableData {
  headers: string[];
  rows: string[][];
}

export interface LegendBoxData {
  title?: string;
  items?: string[];
  badgeTitle?: string;
  badges?: string[];
}

export interface AnswerCardItem {
  title: string;
  fields: string[];
}

export interface FigureCropData {
  pageIndex: number; // 1-indexed page number from documentPages
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in 0..1000 scale
  caption?: string;
  imageUrl?: string; // Optional direct image URL or data URL override
}

export interface CodeMatchingData {
  legendCodes: string[];
  items: string[];
}

export interface ExerciseContent {
  // Contexto opcional antes das opções/tabela (ex: narrativa da pergunta)
  contextText?: string;

  // Para text_comprehension
  readingText?: string;
  readingAuthor?: string;
  readingTitle?: string;
  subQuestions?: string[];

  // Para math_problem
  problemPrompt?: string;
  givenDataPrompt?: string;
  operationPrompt?: string;
  answerPrompt?: string;

  // Para math_calculation
  calculations?: MathCalculationItem[];

  // Para matching
  matchingPairs?: MatchingPair[];

  // Para fill_blank
  wordBank?: string[];
  sentencesWithBlanks?: string[];

  // Para multiple_choice
  question?: string;
  options?: string[];

  // Para true_false
  statements?: string[];

  // Para calligraphy
  calligraphyPrompt?: string;
  pautaType?: 'dupla' | 'simples' | 'quadricula';
  sampleText?: string;
  lineCount?: number;

  // Para drawing_creative
  drawingPrompt?: string;
  boxHeight?: 'compact' | 'normal' | 'large';

  // Para ordering_sequence
  sequenceItems?: string[];

  // Para free_response
  questionPrompt?: string;
  responseLinesCount?: number;

  // Para table_activity (Tabelas + Legendas + Caixa de Respostas)
  structuredTable?: StructuredTableData;
  legendBox?: LegendBoxData;
  answerCards?: AnswerCardItem[];
  sideBySideLegendAndTable?: boolean;

  // Para visual_observation (Ilustração/Esquema recortado do PDF + Causa-Efeito)
  figureCrop?: FigureCropData;
  observationHeading?: string;
  scaffoldPrompt?: string;

  // Para word_discrimination (Riscar a palavra incorreta em pares inline)
  discriminationExample?: string;
  discriminationSentences?: string[];

  // Para code_matching (Associação de códigos A/B/C/D com quadrícula [ ])
  codeMatching?: CodeMatchingData;
}

export interface Exercise {
  id: string;
  number: string;
  title: string;
  groupLabel?: string; // Ex: "GRUPO I", "GRUPO II"
  domainTag?: string;  // Ex: "Compreensão Científica", "Organização de Dados"
  type: ExerciseType;
  content: ExerciseContent;
  points?: string;
  duaTier?: DuaTier;
  duaHint?: string;
  visualDiagram?: VisualDiagramType;
  layoutCols?: 1 | 2 | 3;
  forcePageBreakBefore?: boolean;
  teacherTips?: string;
}

export interface AttachedDocumentMeta {
  name: string;
  size: number;
  type: string;
  extractedPreview?: string;
  pageCount?: number;
}

export interface MultimodalSummary {
  tablesCount: number;
  figuresCount: number;
  legendsCount: number;
  choiceBlocksCount: number;
  fixedPageSplitsCount: number;
}

export interface SelfAssessmentBar {
  title: string;
  options: string[];
}

export interface WorksheetConfig {
  id: string;
  schoolName: string;
  subject: Subject;
  grade: GradeLevel;
  term: string;
  title: string;
  subtitle?: string;
  introBanner?: string;
  selfAssessment?: SelfAssessmentBar;
  documentPages?: string[];
  detectedSummary?: MultimodalSummary;
  studentFields: {
    showName: boolean;
    showDate: boolean;
    showGradeTurma: boolean;
    showNumber: boolean;
  };
  evaluationMode: EvaluationMode;
  showDuaRubric?: boolean;
  showTeacherSignature: boolean;
  showGuardianSignature: boolean;
  themeColor: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'mono';
  neuroPalette?: NeuroPaletteId;
  keepSoftTintOnPrint?: boolean;
  fontFamily: 'lexend' | 'andika' | 'atkinson' | 'nunito' | 'handwriting';
  fontSizeScale: 'sm' | 'base' | 'lg';
  spacingDensity: 'compact' | 'normal' | 'relaxed';
  monochromePrintMode: boolean;
  showHolePunchGuide?: boolean;
  accommodationProfile?: AccommodationProfile;
  highlightActionVerbs?: boolean;
  exercises: Exercise[];
}
