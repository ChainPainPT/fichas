import type {
  Exercise,
  MathCalculationItem,
  MatchingPair,
  VisualDiagramType,
  MultimodalSummary
} from '../types/worksheet.ts';

/**
 * Calcula o resumo multimodal dos elementos visuais ricos detetados num documento
 * (Tabelas, Ilustrações Recortadas, Legendas/Caixas de Palavras, Grelhas de Escolha e Quebras Corrigidas).
 */
export function computeMultimodalSummary(exercises: Exercise[]): MultimodalSummary {
  let tablesCount = 0;
  let figuresCount = 0;
  let legendsCount = 0;
  let choiceBlocksCount = 0;

  for (const ex of exercises || []) {
    const c = ex?.content || {};
    if (ex.type === 'table_activity' || (c.structuredTable && c.structuredTable.rows?.length)) {
      tablesCount++;
    }
    if (ex.type === 'visual_observation' || c.figureCrop || (ex.visualDiagram && ex.visualDiagram !== 'none')) {
      figuresCount++;
    }
    if (
      (c.legendBox && ((c.legendBox.items?.length || 0) > 0 || (c.legendBox.badges?.length || 0) > 0)) ||
      (c.wordBank && c.wordBank.length > 0) ||
      (c.codeMatching && c.codeMatching.legendCodes?.length > 0)
    ) {
      legendsCount++;
    }
    if (
      ex.type === 'multiple_choice' ||
      ex.type === 'word_discrimination' ||
      ex.type === 'true_false'
    ) {
      choiceBlocksCount++;
    }
  }

  return {
    tablesCount,
    figuresCount,
    legendsCount,
    choiceBlocksCount,
    fixedPageSplitsCount: Math.max(1, tablesCount + (choiceBlocksCount > 1 ? 1 : 0))
  };
}

/**
 * Motor Determinístico de Formatação e Estruturação Visual (Zero Invenção de Conteúdo).
 * Suporta texto simples, tabelas Markdown (| Col 1 | Col 2 |), pares inline [opção1 / opção2],
 * bancos de palavras, escolha múltipla e cálculos.
 */
export function parseRawTextToExercises(rawText: string): Exercise[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const exerciseBlocks: { title: string; lines: string[]; number: string }[] = [];
  
  let currentBlock: { title: string; lines: string[]; number: string } | null = null;
  let counter = 1;

  const headerRegex = /^(?:exerc[íi]cio|quest[ãa]o|grupo)?\s*(\d+(?:\.\d+)?|[IVX]+)\s*(?:[º\.\)]|\s*[-–—]\s*(?=[a-záàâãéèêíóòôõúçA-Z]))\s*[:\.]?\s*(.*)$/i;

  for (const line of lines) {
    const match = line.match(headerRegex);
    if (match) {
      if (currentBlock) {
        exerciseBlocks.push(currentBlock);
      }
      const num = match[1] || String(counter);
      const rest = match[2]?.trim() || '';
      currentBlock = {
        number: num.endsWith('.') ? num : `${num}.`,
        title: rest,
        lines: []
      };
      counter++;
    } else {
      if (!currentBlock) {
        currentBlock = {
          number: `${counter}.`,
          title: line,
          lines: []
        };
        counter++;
      } else {
        currentBlock.lines.push(line);
      }
    }
  }

  if (currentBlock) {
    exerciseBlocks.push(currentBlock);
  }

  return exerciseBlocks.map((block, idx) => {
    return classifyAndFormatExercise(block.number, block.title, block.lines, idx);
  });
}

function detectRecommendedDiagram(combinedText: string, type: string): VisualDiagramType {
  if (combinedText.includes('fração') || combinedText.includes('frações') || combinedText.includes('quarta parte') || combinedText.includes('terça parte')) {
    return 'fraction_bars';
  }
  if (combinedText.includes('relógio') || combinedText.includes('que horas')) {
    return 'analog_clock';
  }
  if (combinedText.includes('reta numérica') || combinedText.includes('reta graduada')) {
    return 'number_line';
  }
  if (combinedText.includes('multibásico') || combinedText.includes('mab') || combinedText.includes('centenas e dezenas')) {
    return 'mab_blocks';
  }
  if (combinedText.includes('sequência') || combinedText.includes('ordena os acontecimentos') || combinedText.includes('etapas')) {
    return 'thinking_map_flow';
  }
  if (combinedText.includes('caraterísticas') || combinedText.includes('adjetivos da personagem') || combinedText.includes('mapa de bolhas')) {
    return 'thinking_map_bubble';
  }
  if (type === 'math_problem') {
    return 'bar_model';
  }
  return 'none';
}

function classifyAndFormatExercise(
  number: string,
  rawTitle: string,
  lines: string[],
  index: number
): Exercise {
  const title = rawTitle || lines[0] || `Exercício ${number}`;
  const bodyLines = rawTitle ? lines : lines.slice(1);
  const combinedText = `${title} ${bodyLines.join(' ')}`.toLowerCase();

  // 0. Deteção de Tabelas Markdown (| Col1 | Col2 |) ou instrução de tabela
  const tableLines = bodyLines.filter(l => l.includes('|'));
  if (tableLines.length >= 2) {
    const nonSeparatorLines = tableLines.filter(l => !/^\|?[\s\-:\|]+\|?$/.test(l));
    const parsedRows = nonSeparatorLines.map(l =>
      l
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(c => c.trim())
    );
    const headers = parsedRows[0] || ['Coluna 1', 'Coluna 2'];
    const rows = parsedRows.slice(1);
    const contextLines = bodyLines.filter(l => !l.includes('|'));

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'table_activity',
      content: {
        contextText: contextLines.join(' ') || undefined,
        structuredTable: {
          headers,
          rows: rows.length > 0 ? rows : [['', '']]
        }
      }
    };
  }

  // 0.B Deteção de Discriminação de Conceitos ([opção1 / opção2] ou "risca a palavra incorreta")
  if (
    combinedText.includes('risca com um traço') ||
    combinedText.includes('palavra incorreta') ||
    bodyLines.some(l => /\[[^\]]+\/[^\]]+\]/.test(l))
  ) {
    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'word_discrimination',
      content: {
        discriminationSentences: bodyLines.length > 0 ? bodyLines : [title]
      }
    };
  }

  // 1. Desenho / Expressão Visual
  if (
    combinedText.includes('desenha') ||
    combinedText.includes('ilustra') ||
    combinedText.includes('faz um desenho') ||
    combinedText.includes('pinta a') ||
    combinedText.includes('pinta o')
  ) {
    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'drawing_creative',
      visualDiagram: detectRecommendedDiagram(combinedText, 'drawing_creative'),
      content: {
        drawingPrompt: bodyLines.join(' '),
        boxHeight: combinedText.includes('grande') ? 'large' : 'normal'
      }
    };
  }

  // 2. Verdadeiro / Falso (V / F)
  if (
    combinedText.includes('verdadeiro') ||
    combinedText.includes('falso') ||
    combinedText.includes('assinala com v') ||
    combinedText.includes('(v)') ||
    combinedText.includes('[v]') ||
    bodyLines.some(l => /^\s*[\(\[]?\s*[vf\?]\s*[\)\]]/i.test(l))
  ) {
    const statements = bodyLines
      .map(l => l.replace(/^[\(\[]?\s*[vf\?_]\s*[\)\]]?\s*[-–]?\s*/i, '').trim())
      .filter(l => l.length > 0);

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'true_false',
      content: {
        statements: statements.length > 0 ? statements : [title]
      }
    };
  }

  // 3. Operações e Cálculo Matemático
  const mathCalcRegex = /(\d+)\s*([\+\-\*x×:\/])\s*(\d+)/i;
  const isMathCalc =
    combinedText.includes('efetua') ||
    combinedText.includes('calcula') ||
    combinedText.includes('contas') ||
    combinedText.includes('operaç') ||
    bodyLines.some(l => mathCalcRegex.test(l));

  if (isMathCalc && !combinedText.includes('problema') && !combinedText.includes('quantos') && !combinedText.includes('quantas')) {
    const calcs: MathCalculationItem[] = [];
    for (const l of [title, ...bodyLines]) {
      const match = l.match(mathCalcRegex);
      if (match) {
        calcs.push({
          operation: l.replace(/^[a-z0-9][\.\)]\s*/i, '').trim(),
          term1: match[1],
          operator: (match[2] === '*' ? '×' : match[2]) as any,
          term2: match[3],
          vertical: true,
          showGrid: true
        });
      }
    }

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'math_calculation',
      layoutCols: Math.min(Math.max(calcs.length, 1), 3) as 1 | 2 | 3,
      visualDiagram: detectRecommendedDiagram(combinedText, 'math_calculation'),
      content: {
        calculations: calcs
      }
    };
  }

  // 4. Ligar Colunas / Correspondência
  const hasWordPair = bodyLines.some(l => /[a-záàâãéèêíóòôõúçA-Z0-9]\s*(?:->|—|\s+-\s+)\s*[a-záàâãéèêíóòôõúçA-Z0-9]/i.test(l));
  if (
    combinedText.includes('liga as') ||
    combinedText.includes('faz corresponder') ||
    combinedText.includes('liga cada') ||
    combinedText.includes('associa as') ||
    hasWordPair
  ) {
    const pairs: MatchingPair[] = [];
    for (const l of bodyLines) {
      const parts = l.split(/->|—|\s+-\s+/);
      if (parts.length >= 2) {
        pairs.push({
          left: parts[0].trim().replace(/^[a-z0-9][\.\)]\s*/i, ''),
          right: parts.slice(1).join(' - ').trim()
        });
      }
    }

    if (pairs.length === 0 && bodyLines.length >= 2) {
      const half = Math.ceil(bodyLines.length / 2);
      for (let i = 0; i < half; i++) {
        pairs.push({
          left: bodyLines[i] || '',
          right: bodyLines[i + half] || ''
        });
      }
    }

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'matching',
      content: {
        matchingPairs: pairs
      }
    };
  }

  // 5. Problema Matemático (Dados / Operação / Resposta + Bar Model C.R.A.)
  if (
    combinedText.includes('problema') ||
    combinedText.includes('quantas ') ||
    combinedText.includes('quantos ') ||
    combinedText.includes('ao todo') ||
    combinedText.includes('com quantos ficou') ||
    combinedText.includes('sobrou') ||
    combinedText.includes('sobraram')
  ) {
    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'math_problem',
      visualDiagram: detectRecommendedDiagram(combinedText, 'math_problem'),
      content: {
        problemPrompt: bodyLines.join(' ') || title,
        givenDataPrompt: 'Dados / Esquema',
        operationPrompt: 'Operação / Cálculo (Grelha)',
        answerPrompt: 'Resposta completa'
      }
    };
  }

  // 6. Caligrafia / Cópia na Pauta Tripla
  if (
    combinedText.includes('caligrafia') ||
    combinedText.includes('copia para a pauta') ||
    combinedText.includes('escreve com a tua melhor letra') ||
    combinedText.includes('treina a escrita')
  ) {
    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'calligraphy',
      content: {
        sampleText: bodyLines.join(' ') || title,
        pautaType: 'dupla',
        lineCount: 2
      }
    };
  }

  // 7. Preencher Espaços / Lacunas
  if (
    combinedText.includes('completa os espaços') ||
    combinedText.includes('preenche os espaços') ||
    combinedText.includes('completa as frases') ||
    bodyLines.some(l => l.includes('___') || l.includes('...'))
  ) {
    let wordBank: string[] = [];
    const wordBankLine = bodyLines.find(l => l.toLowerCase().includes('palavras:') || (l.includes('[') && l.includes(']')));
    if (wordBankLine) {
      wordBank = wordBankLine
        .replace(/.*palavras:\s*/i, '')
        .replace(/[\[\]]/g, '')
        .split(/[,;·]+/)
        .map(w => w.trim())
        .filter(Boolean);
    }

    const sentences = bodyLines.filter(l => l !== wordBankLine);

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'fill_blank',
      content: {
        wordBank,
        sentencesWithBlanks: sentences.length > 0 ? sentences : [title]
      }
    };
  }

  // 8. Escolha Múltipla (Grelha Simétrica de 2 Colunas A/B | C/D)
  const optionRegex = /^(?:\[?\s*[A-D]\s*\]?|[A-D][\)\.\-])\s+(.+)$/i;
  const optionLines = bodyLines.filter(l => optionRegex.test(l));
  if (
    combinedText.includes('escolha múltipla') ||
    combinedText.includes('opção correta') ||
    combinedText.includes('assinala com x') ||
    optionLines.length >= 2
  ) {
    const nonOptionLines = bodyLines.filter(l => !optionRegex.test(l));
    const options = optionLines.map(l => l.replace(/^(?:\[?\s*[A-D]\s*\]?|[A-D][\)\.\-])\s+/i, '').trim());

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'multiple_choice',
      content: {
        question: nonOptionLines.join(' ') || undefined,
        options: options.length > 0 ? options : bodyLines
      }
    };
  }

  // 9. Texto de Leitura com Perguntas de Interpretação
  if (
    bodyLines.length >= 2 &&
    (combinedText.includes('lê o texto') ||
     combinedText.includes('interpretação') ||
     bodyLines.some(l => /^[a-z0-9]+[\)\.]\s*/i.test(l) || l.endsWith('?')))
  ) {
    const subQuestions: string[] = [];
    const textLines: string[] = [];

    for (const l of bodyLines) {
      if (/^[a-z0-9]+[\)\.]\s*/i.test(l) || l.endsWith('?')) {
        subQuestions.push(l.replace(/^[a-z0-9]+[\)\.]\s*/i, '').trim());
      } else {
        textLines.push(l);
      }
    }

    return {
      id: `ex-${Date.now()}-${index}`,
      number,
      title,
      type: 'text_comprehension',
      visualDiagram: detectRecommendedDiagram(combinedText, 'text_comprehension'),
      content: {
        readingTitle: textLines.length > 1 ? textLines[0] : undefined,
        readingText: textLines.length > 1 ? textLines.slice(1).join('\n\n') : textLines.join('\n'),
        subQuestions
      }
    };
  }

  // 10. Pergunta de Resposta Escrita
  return {
    id: `ex-${Date.now()}-${index}`,
    number,
    title,
    type: 'free_response',
    visualDiagram: detectRecommendedDiagram(combinedText, 'free_response'),
    content: {
      questionPrompt: bodyLines.join('\n'),
      responseLinesCount: 3
    }
  };
}

const VALID_TYPES = new Set([
  'text_comprehension',
  'multiple_choice',
  'math_problem',
  'math_calculation',
  'matching',
  'fill_blank',
  'true_false',
  'calligraphy',
  'drawing_creative',
  'ordering_sequence',
  'free_response',
  'table_activity',
  'visual_observation',
  'word_discrimination',
  'code_matching'
]);

const VALID_DIAGRAMS = new Set([
  'none',
  'bar_model',
  'mab_blocks',
  'number_line',
  'fraction_bars',
  'analog_clock',
  'thinking_map_bubble',
  'thinking_map_flow',
  'thinking_map_tree'
]);

function toSafeString(val: unknown): string {
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    const candidate =
      obj.text ??
      obj.question ??
      obj.statement ??
      obj.sentence ??
      obj.option ??
      obj.value ??
      obj.prompt ??
      obj.title ??
      obj.label;
    if (typeof candidate === 'string') return candidate.trim();
    if (typeof candidate === 'number') return String(candidate);
  }
  return '';
}

function toSafeStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) {
    if (typeof val === 'string' && val.trim()) {
      return val.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }
  return val.map(toSafeString).filter(Boolean);
}

/**
 * Sanitiza e normaliza qualquer lista de exercícios vinda da IA, upload de ficheiro ou localStorage,
 * preservando tabelas estruturadas, recortes de figuras originais, legendas, pares inline e caixas de resposta.
 */
export function normalizeExercises(rawExercises: unknown, fallbackRawText?: string): Exercise[] {
  if (!Array.isArray(rawExercises) || rawExercises.length === 0) {
    return fallbackRawText ? parseRawTextToExercises(fallbackRawText) : [];
  }

  const normalized: Exercise[] = rawExercises
    .filter((item): item is Record<string, any> => Boolean(item && typeof item === 'object'))
    .map((raw, idx) => {
      const c: Record<string, any> =
        raw.content && typeof raw.content === 'object' ? raw.content : {};

      const number = toSafeString(raw.number) || `${idx + 1}.`;
      const title =
        toSafeString(raw.title) ||
        toSafeString(raw.prompt) ||
        toSafeString(raw.instruction) ||
        toSafeString(c.questionPrompt) ||
        toSafeString(c.question) ||
        `Exercício ${number}`;

      let rawType = toSafeString(raw.type);
      // Auto-upgrade to rich types if structured data is present
      if (!VALID_TYPES.has(rawType)) {
        if (c.structuredTable || raw.structuredTable) rawType = 'table_activity';
        else if (c.figureCrop || raw.figureCrop) rawType = 'visual_observation';
        else if (c.discriminationSentences || raw.discriminationSentences) rawType = 'word_discrimination';
        else if (c.codeMatching || raw.codeMatching) rawType = 'code_matching';
        else rawType = 'free_response';
      }
      const type = rawType as Exercise['type'];

      const rawDiagram = toSafeString(raw.visualDiagram);
      const visualDiagram = (
        VALID_DIAGRAMS.has(rawDiagram)
          ? rawDiagram
          : detectRecommendedDiagram(`${title} ${toSafeString(c.problemPrompt)}`.toLowerCase(), type)
      ) as VisualDiagramType;

      const subQuestions = toSafeStringArray(
        c.subQuestions ?? c.questions ?? raw.subQuestions ?? raw.questions
      );
      const options = toSafeStringArray(c.options ?? c.choices ?? raw.options ?? raw.choices);
      const statements = toSafeStringArray(
        c.statements ?? c.items ?? raw.statements ?? raw.items
      );
      const wordBank = toSafeStringArray(c.wordBank ?? c.words ?? raw.wordBank ?? raw.words);
      const sentencesWithBlanks = toSafeStringArray(
        c.sentencesWithBlanks ?? c.sentences ?? raw.sentencesWithBlanks ?? raw.sentences
      );

      // Normalizar pares de correspondência
      const rawPairs = Array.isArray(c.matchingPairs)
        ? c.matchingPairs
        : Array.isArray(c.pairs)
        ? c.pairs
        : Array.isArray(raw.matchingPairs)
        ? raw.matchingPairs
        : [];
      const matchingPairs: MatchingPair[] = rawPairs
        .map((p: any) => {
          if (typeof p === 'string') {
            const parts = p.split(/->|—|\s+-\s+/);
            return {
              left: (parts[0] || p).trim(),
              right: (parts.slice(1).join(' - ') || '').trim()
            };
          }
          if (p && typeof p === 'object') {
            return {
              left: toSafeString(p.left ?? p.columnA ?? p.source ?? p.a ?? p.term),
              right: toSafeString(p.right ?? p.columnB ?? p.target ?? p.b ?? p.definition)
            };
          }
          return { left: '', right: '' };
        })
        .filter((p: MatchingPair) => p.left || p.right);

      // Normalizar operações matemáticas
      const rawCalcs = Array.isArray(c.calculations)
        ? c.calculations
        : Array.isArray(c.operations)
        ? c.operations
        : Array.isArray(raw.calculations)
        ? raw.calculations
        : [];
      const calculations: MathCalculationItem[] = rawCalcs
        .map((calc: any) => {
          if (typeof calc === 'string') {
            const m = calc.match(/(\d+)\s*([\+\-\*x×:\/])\s*(\d+)/);
            return {
              operation: calc.trim(),
              term1: m?.[1] || '',
              operator: ((m?.[2] === '*' ? '×' : m?.[2]) || '+') as any,
              term2: m?.[3] || '',
              vertical: true,
              showGrid: true
            };
          }
          if (calc && typeof calc === 'object') {
            const opStr = toSafeString(calc.operation ?? calc.expression);
            const m = opStr.match(/(\d+)\s*([\+\-\*x×:\/])\s*(\d+)/);
            return {
              operation: opStr || `${toSafeString(calc.term1)} ${toSafeString(calc.operator) || '+'} ${toSafeString(calc.term2)}`,
              term1: toSafeString(calc.term1) || m?.[1] || '0',
              operator: (toSafeString(calc.operator) || m?.[2] || '+') as any,
              term2: toSafeString(calc.term2) || m?.[3] || '0',
              vertical: calc.vertical !== false,
              showGrid: calc.showGrid !== false
            };
          }
          return null;
        })
        .filter(Boolean) as MathCalculationItem[];

      // Normalizar Tabelas Estruturadas
      const rawTable = c.structuredTable ?? raw.structuredTable;
      const structuredTable =
        rawTable && typeof rawTable === 'object'
          ? {
              headers: toSafeStringArray(rawTable.headers),
              rows: Array.isArray(rawTable.rows)
                ? rawTable.rows.map((r: unknown) =>
                    Array.isArray(r) ? r.map((cell) => toSafeString(cell)) : [toSafeString(r)]
                  )
                : []
            }
          : undefined;

      // Normalizar Legendas e Etiquetas de Código
      const rawLegend = c.legendBox ?? raw.legendBox;
      const legendBox =
        rawLegend && typeof rawLegend === 'object'
          ? {
              title: toSafeString(rawLegend.title) || undefined,
              items: toSafeStringArray(rawLegend.items),
              badgeTitle: toSafeString(rawLegend.badgeTitle) || undefined,
              badges: toSafeStringArray(rawLegend.badges)
            }
          : undefined;

      // Normalizar Caixa de Respostas (answerCards)
      const rawAnswerCards = c.answerCards ?? raw.answerCards;
      const answerCards = Array.isArray(rawAnswerCards)
        ? rawAnswerCards
            .filter((ac: any) => ac && typeof ac === 'object')
            .map((ac: any) => ({
              title: toSafeString(ac.title),
              fields: toSafeStringArray(ac.fields)
            }))
        : undefined;

      // Normalizar Recorte de Ilustração / Esquema Original (figureCrop)
      const rawCrop = c.figureCrop ?? raw.figureCrop;
      const figureCrop =
        rawCrop && typeof rawCrop === 'object'
          ? {
              pageIndex: Math.max(1, Number(rawCrop.pageIndex) || 1),
              box2d: (
                Array.isArray(rawCrop.box2d) && rawCrop.box2d.length === 4
                  ? rawCrop.box2d.map((n: any) => Number(n) || 0)
                  : [120, 90, 340, 500]
              ) as [number, number, number, number],
              caption: toSafeString(rawCrop.caption) || undefined,
              imageUrl: toSafeString(rawCrop.imageUrl) || undefined
            }
          : undefined;

      // Normalizar Discriminação de Conceitos
      const discriminationSentences = toSafeStringArray(
        c.discriminationSentences ?? raw.discriminationSentences
      );

      // Normalizar Associação de Códigos com Quadrícula
      const rawCodeMatching = c.codeMatching ?? raw.codeMatching;
      const codeMatching =
        rawCodeMatching && typeof rawCodeMatching === 'object'
          ? {
              legendCodes: toSafeStringArray(rawCodeMatching.legendCodes),
              items: toSafeStringArray(rawCodeMatching.items)
            }
          : undefined;

      const contextText =
        toSafeString(c.contextText ?? raw.contextText) || undefined;
      const readingText =
        toSafeString(c.readingText ?? c.text ?? c.passage ?? raw.readingText ?? raw.text) || undefined;
      const readingTitle =
        toSafeString(c.readingTitle ?? c.textTitle ?? raw.readingTitle) || undefined;
      const readingAuthor =
        toSafeString(c.readingAuthor ?? c.author ?? raw.readingAuthor) || undefined;

      const problemPrompt =
        toSafeString(c.problemPrompt ?? c.problem ?? c.text ?? raw.problemPrompt) ||
        (type === 'math_problem' ? title : undefined);

      const question =
        toSafeString(c.question ?? c.questionPrompt ?? raw.question) || undefined;

      const questionPrompt =
        toSafeString(c.questionPrompt ?? c.question ?? c.text ?? raw.questionPrompt) || undefined;

      const sampleText =
        toSafeString(c.sampleText ?? c.calligraphyPrompt ?? c.text ?? raw.sampleText) ||
        (type === 'calligraphy' ? title : undefined);

      const drawingPrompt =
        toSafeString(c.drawingPrompt ?? c.prompt ?? c.text ?? raw.drawingPrompt) || undefined;

      return {
        id: toSafeString(raw.id) || `ex-${Date.now()}-${idx}`,
        number: number.endsWith('.') ? number : `${number}.`,
        groupLabel: toSafeString(raw.groupLabel) || undefined,
        domainTag: toSafeString(raw.domainTag) || undefined,
        title,
        type,
        points: toSafeString(raw.points) || undefined,
        duaTier: ['N1', 'N2', 'N3'].includes(toSafeString(raw.duaTier))
          ? (toSafeString(raw.duaTier) as Exercise['duaTier'])
          : undefined,
        duaHint: toSafeString(raw.duaHint) || undefined,
        visualDiagram,
        layoutCols: [1, 2, 3].includes(Number(raw.layoutCols))
          ? (Number(raw.layoutCols) as 1 | 2 | 3)
          : undefined,
        forcePageBreakBefore: Boolean(raw.forcePageBreakBefore),
        content: {
          contextText,
          readingTitle,
          readingAuthor,
          readingText,
          subQuestions,
          problemPrompt,
          givenDataPrompt: toSafeString(c.givenDataPrompt) || 'Dados / Esquema C.R.A.',
          operationPrompt: toSafeString(c.operationPrompt) || 'Operação / Cálculo (Grelha)',
          answerPrompt: toSafeString(c.answerPrompt) || 'Resposta completa',
          calculations,
          matchingPairs,
          wordBank,
          sentencesWithBlanks:
            sentencesWithBlanks.length > 0
              ? sentencesWithBlanks
              : type === 'fill_blank'
              ? [readingText || questionPrompt || title]
              : [],
          question,
          options:
            options.length > 0
              ? options
              : type === 'multiple_choice'
              ? subQuestions.length > 0
                ? subQuestions
                : ['Opção A', 'Opção B', 'Opção C', 'Opção D']
              : [],
          statements:
            statements.length > 0
              ? statements
              : type === 'true_false'
              ? subQuestions.length > 0
                ? subQuestions
                : [readingText || questionPrompt || title]
              : [],
          sampleText,
          pautaType: 'dupla',
          lineCount: Math.min(Math.max(Number(c.lineCount) || 2, 1), 6),
          drawingPrompt,
          boxHeight: ['compact', 'normal', 'large'].includes(toSafeString(c.boxHeight))
            ? (toSafeString(c.boxHeight) as 'compact' | 'normal' | 'large')
            : 'normal',
          questionPrompt,
          responseLinesCount: Math.min(Math.max(Number(c.responseLinesCount) || 3, 1), 8),
          structuredTable,
          legendBox,
          answerCards,
          sideBySideLegendAndTable: Boolean(c.sideBySideLegendAndTable ?? raw.sideBySideLegendAndTable),
          figureCrop,
          observationHeading: toSafeString(c.observationHeading) || undefined,
          scaffoldPrompt: toSafeString(c.scaffoldPrompt) || undefined,
          discriminationExample: toSafeString(c.discriminationExample) || undefined,
          discriminationSentences:
            discriminationSentences.length > 0
              ? discriminationSentences
              : type === 'word_discrimination'
              ? statements
              : undefined,
          codeMatching
        }
      };
    });

  return normalized.length > 0
    ? normalized
    : fallbackRawText
    ? parseRawTextToExercises(fallbackRawText)
    : [];
}
