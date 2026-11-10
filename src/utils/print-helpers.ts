import { Exercise, WorksheetConfig } from '../types/worksheet';

export interface PageBudgetEstimate {
  estimatedPageCount: number;
  usableHeightPerPagePx: number;
  totalContentHeightPx: number;
  exerciseHeights: { id: string; heightPx: number; startsAtPage: number; willFitOnCurrentPage: boolean }[];
  recommendation?: {
    action: 'compact_to_fit' | 'expand_to_fill' | 'balanced' | 'single_page_ready';
    message: string;
    suggestedSpacing?: 'compact' | 'normal' | 'relaxed';
    suggestedFontSize?: 'sm' | 'base' | 'lg';
  };
}

const USABLE_PAGE_HEIGHT_PX = 980; // A4 297mm minus margins (approx 260mm in web rendering scale)
const HEADER_BASE_HEIGHT_PX = 130;

/**
 * Calculates estimated height in pixels for an exercise based on its type and density settings.
 */
export function estimateExerciseHeight(
  exercise: Exercise,
  density: 'compact' | 'normal' | 'relaxed' = 'normal',
  fontSize: 'sm' | 'base' | 'lg' = 'base'
): number {
  let base = 80;
  const content = exercise?.content || {};

  const densityMultiplier = density === 'compact' ? 0.78 : density === 'relaxed' ? 1.25 : 1.0;
  const fontMultiplier = fontSize === 'sm' ? 0.9 : fontSize === 'lg' ? 1.15 : 1.0;

  switch (exercise?.type) {
    case 'text_comprehension': {
      const textLen = typeof content.readingText === 'string' ? content.readingText.length : 100;
      const questionsCount = Array.isArray(content.subQuestions) ? content.subQuestions.length : 2;
      base = 120 + Math.min(textLen * 0.15, 120) + (questionsCount * 45);
      break;
    }
    case 'math_problem':
      base = 175;
      break;
    case 'math_calculation': {
      const calcs = Array.isArray(content.calculations) ? content.calculations.length : 3;
      const cols = exercise?.layoutCols || 3;
      const rows = Math.ceil(calcs / cols);
      base = 80 + rows * 85;
      break;
    }
    case 'matching': {
      const pairs = Array.isArray(content.matchingPairs) ? content.matchingPairs.length : 4;
      base = 70 + pairs * 34;
      break;
    }
    case 'fill_blank': {
      const count = Array.isArray(content.sentencesWithBlanks) ? content.sentencesWithBlanks.length : 3;
      base = 95 + count * 42;
      break;
    }
    case 'multiple_choice': {
      const opts = Array.isArray(content.options) ? content.options.length : 4;
      const rows = Math.ceil(opts / 2);
      base = 85 + rows * 52;
      break;
    }
    case 'true_false': {
      const stmts = Array.isArray(content.statements) ? content.statements.length : 4;
      base = 65 + stmts * 32;
      break;
    }
    case 'calligraphy': {
      const lines = Number(content.lineCount) || 3;
      base = 75 + lines * 36;
      break;
    }
    case 'drawing_creative': {
      const box = content.boxHeight;
      base = box === 'large' ? 220 : box === 'compact' ? 130 : 170;
      break;
    }
    case 'table_activity': {
      const rows = Array.isArray(content.structuredTable?.rows)
        ? content.structuredTable!.rows.length
        : 5;
      const hasAnswerCards = Array.isArray(content.answerCards) && content.answerCards.length > 0;
      base = 110 + rows * 38 + (hasAnswerCards ? 95 : 0);
      break;
    }
    case 'visual_observation': {
      base = 245;
      break;
    }
    case 'word_discrimination': {
      const sents = Array.isArray(content.discriminationSentences)
        ? content.discriminationSentences.length
        : 4;
      base = 90 + sents * 44;
      break;
    }
    case 'code_matching': {
      const items = Array.isArray(content.codeMatching?.items)
        ? content.codeMatching!.items.length
        : 4;
      base = 95 + items * 46;
      break;
    }
    case 'ordering_sequence': {
      const items = Array.isArray(content.sequenceItems) ? content.sequenceItems.length : 4;
      base = 70 + items * 34;
      break;
    }
    case 'free_response':
    default: {
      const lines = Number(content.responseLinesCount) || 3;
      base = 60 + lines * 28;
      break;
    }
  }

  return Math.round(base * densityMultiplier * fontMultiplier);
}

/**
 * Simulates page flow and tests whether exercises will break across pages or fit neatly.
 */
export function calculatePageBudget(config: WorksheetConfig): PageBudgetEstimate {
  const density = config?.spacingDensity || 'normal';
  const fontSize = config?.fontSizeScale || 'base';
  const exercises = Array.isArray(config?.exercises) ? config.exercises : [];

  let currentPage = 1;
  let currentHeightOnPage = HEADER_BASE_HEIGHT_PX + (config?.introBanner ? 60 : 0);
  let totalHeight = currentHeightOnPage;

  const exerciseHeights = exercises.map((ex) => {
    const height = estimateExerciseHeight(ex, density, fontSize);
    
    if (ex?.forcePageBreakBefore && currentHeightOnPage > HEADER_BASE_HEIGHT_PX) {
      currentPage++;
      currentHeightOnPage = 40;
    }

    let willFit = (currentHeightOnPage + height) <= USABLE_PAGE_HEIGHT_PX;

    if (!willFit && currentHeightOnPage > 40) {
      currentPage++;
      currentHeightOnPage = 40 + height;
      willFit = true;
    } else {
      currentHeightOnPage += height + 16;
    }

    totalHeight += height;

    return {
      id: ex.id,
      heightPx: height,
      startsAtPage: currentPage,
      willFitOnCurrentPage: willFit
    };
  });

  const estimatedPageCount = currentPage;
  let recommendation: PageBudgetEstimate['recommendation'] = {
    action: 'balanced',
    message: `Distribuição equilibrada em ${estimatedPageCount} página(s). Nenhum exercício nem tabela ficará dividido.`
  };

  if (estimatedPageCount === 2 && currentHeightOnPage < 220 && exercises.length <= 5) {
    recommendation = {
      action: 'compact_to_fit',
      message: 'A ficha tem apenas 1 exercício na página 2. Podes compactar para caber perfeitamente numa só página A4!',
      suggestedSpacing: 'compact',
      suggestedFontSize: 'sm'
    };
  } else if (estimatedPageCount === 1) {
    recommendation = {
      action: 'single_page_ready',
      message: 'Perfeito! Todos os exercícios cabem numa única folha A4 com espaço confortável.'
    };
  }

  return {
    estimatedPageCount,
    usableHeightPerPagePx: USABLE_PAGE_HEIGHT_PX,
    totalContentHeightPx: totalHeight,
    exerciseHeights,
    recommendation
  };
}

/**
 * Computes suggested spacing and font size to fit into targetPages (1 or 2).
 */
export function getFitToTargetRecommendation(
  exercises: Exercise[],
  targetPages: 1 | 2
): { spacing: 'compact' | 'normal' | 'relaxed'; fontSize: 'sm' | 'base' | 'lg' } {
  if (targetPages === 1) {
    if (exercises.length > 4) {
      return { spacing: 'compact', fontSize: 'sm' };
    }
    return { spacing: 'compact', fontSize: 'base' };
  } else {
    if (exercises.length <= 3) {
      return { spacing: 'relaxed', fontSize: 'lg' };
    } else if (exercises.length > 7) {
      return { spacing: 'compact', fontSize: 'sm' };
    }
    return { spacing: 'normal', fontSize: 'base' };
  }
}
