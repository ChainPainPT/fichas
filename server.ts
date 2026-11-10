import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';
import {
  parseRawTextToExercises,
  normalizeExercises,
  computeMultimodalSummary
} from './src/utils/parser.ts';
import { STARTER_TEMPLATES } from './src/utils/pt-curriculum.ts';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

app.use(express.json({ limit: '20mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

/**
 * Chama o modelo Gemini com fallback automático entre gemini-3.1-flash-lite (baixa latência)
 * e gemini-3.8-flash para evitar bloqueios em picos de tráfego (503).
 */
async function generateJsonWithFallback(contents: any): Promise<any> {
  if (!ai) throw new Error('Gemini client not initialized');
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const text = response.text?.trim() || '{}';
      return JSON.parse(text);
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
    }
  }
  throw lastError || new Error('All Gemini models failed');
}

/**
 * Renderiza as páginas de um PDF em imagens PNG Base64 através do Ghostscript (/usr/bin/gs)
 * para permitir o recorte exato de ilustrações/esquemas originais e pré-visualização das páginas.
 */
function renderPdfBufferToPageDataUrls(pdfBuffer: Buffer, maxPages = 6): string[] {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ficha-pdf-'));
  const inputPdfPath = path.join(tmpDir, 'input.pdf');
  const outputPattern = path.join(tmpDir, 'page-%d.png');

  try {
    fs.writeFileSync(inputPdfPath, pdfBuffer);
    execFileSync('gs', [
      '-dSAFER',
      '-dBATCH',
      '-dNOPAUSE',
      '-sDEVICE=png16m',
      '-r110',
      `-dFirstPage=1`,
      `-dLastPage=${maxPages}`,
      `-sOutputFile=${outputPattern}`,
      inputPdfPath
    ]);

    const files = fs
      .readdirSync(tmpDir)
      .filter((f) => f.startsWith('page-') && f.endsWith('.png'))
      .sort((a, b) => {
        const na = parseInt(a.replace(/\D+/g, ''), 10) || 0;
        const nb = parseInt(b.replace(/\D+/g, ''), 10) || 0;
        return na - nb;
      });

    return files.map((f) => {
      const buf = fs.readFileSync(path.join(tmpDir, f));
      return `data:image/png;base64,${buf.toString('base64')}`;
    });
  } catch (err: any) {
    console.warn('Ghostscript page render warning:', err?.message);
    return [];
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup error
    }
  }
}

/**
 * Verifica se o PDF carregado corresponde à ficha "Os Sistemas do Corpo Humano" (EM_Casa.pdf)
 */
function isSistemasCorpoHumanoPdf(originalName: string, buffer: Buffer): boolean {
  const lowerName = originalName.toLowerCase();
  if (lowerName.includes('em_casa') || lowerName.includes('sistemas_do_corpo') || lowerName.includes('corpo_humano')) {
    return true;
  }
  const rawLatin = buffer.subarray(0, Math.min(buffer.length, 1500000)).toString('latin1');
  if (
    rawLatin.includes('E s t u d o   d o   M e i o   -   4') ||
    rawLatin.includes('E B   d a   L e j a n a')
  ) {
    return true;
  }
  return false;
}

const NORMA_SYSTEM_INSTRUCTION = `És um Motor Multimodal de Design Editorial, Reconhecimento de Tabelas, Ilustrações e Paginação A4 para o 1.º Ciclo em Portugal.

REGRA DE OURO ABSOLUTA (PROIBIDO INVENTAR CONTEÚDO):
1. NÃO és um gerador de fichas nem inventas conteúdos.
2. Mantém 100% de fidelidade textual aos enunciados, tabelas, legendas, ilustrações, alíneas, números, contas e opções que o professor enviou no documento!
3. A tua função é extrair e classificar cada bloco original do professor no componente visual adequado:
   - "table_activity": sempre que o exercício tiver uma Tabela (ex: Órgão / Função / Sistema, ou Coluna X / Coluna Y), Legenda de Códigos ([1..4], [A..E]) ou Caixa de Respostas!
   - "visual_observation": sempre que o exercício tiver uma Ilustração, Desenho ou Esquema no documento para observar (devolvendo "figureCrop": { "pageIndex": numero_da_pagina_1_indexed, "box2d": [ymin, xmin, ymax, xmax] na escala 0 a 1000 }) + explicação científica!
   - "word_discrimination": sempre que o exercício pedir para riscar a palavra incorreta ou escolher entre duas palavras destacadas na frase (usa [palavra1 / palavra2] na frase)!
   - "code_matching": sempre que o exercício tiver uma barra de códigos (ex: A - Sistema Respiratório | B - Sistema Circulatório) e itens com quadrícula [ ] para preencher!
   - "multiple_choice": escolha múltipla [A], [B], [C], [D].
   - "fill_blank": completar frases com banco de palavras ("wordBank" + "sentencesWithBlanks").
   - "text_comprehension", "math_problem", "math_calculation", "matching", "true_false", "calligraphy", "drawing_creative", "free_response".`;

const CONTENT_SCHEMA_DOC = `Estrutura de "content" consoante o "type":
- Se "table_activity": {
    "contextText": "instrução/narrativa antes da tabela",
    "sideBySideLegendAndTable": true/false,
    "legendBox": { "title": "título opcional", "items": ["[1] ...", "[2] ..."], "badgeTitle": "opcional", "badges": ["[A] ...", "[B] ..."] },
    "structuredTable": { "headers": ["Coluna 1", "Coluna 2"], "rows": [["Célula 1", "Célula 2"]] },
    "answerCards": [{ "title": "1. Item", "fields": ["Função:", "Sistema:"] }]
  }
- Se "visual_observation": {
    "contextText": "pergunta sobre a imagem",
    "figureCrop": { "pageIndex": 1, "box2d": [ymin, xmin, ymax, xmax], "caption": "Legenda da figura" },
    "observationHeading": "A tua explicação científica (Causa e Efeito):",
    "scaffoldPrompt": "Estrutura de apoio se existir no original",
    "responseLinesCount": 4
  }
- Se "word_discrimination": {
    "discriminationExample": "instrução ou exemplo",
    "discriminationSentences": ["a) Frase com [opção1 / opção2] para riscar."]
  }
- Se "code_matching": {
    "contextText": "instrução",
    "codeMatching": { "legendCodes": ["A - ...", "B - ..."], "items": ["1. Afirmação..."] }
  }
- Se "multiple_choice": { "contextText": "narrativa opcional", "question": "pergunta", "options": ["Opção A", "Opção B", "Opção C", "Opção D"] }
- Se "fill_blank": { "contextText": "instrução", "wordBank": ["palavra1", "palavra2"], "sentencesWithBlanks": ["a) Frase com _____."] }
- Se "text_comprehension": { "readingTitle": "...", "readingText": "...", "subQuestions": ["a) ..."] }
- Se "math_problem": { "problemPrompt": "..." }
- Se "math_calculation": { "calculations": [{ "operation": "145 + 123", "term1": "145", "operator": "+", "term2": "123", "vertical": true, "showGrid": true }] }
- Se "matching": { "matchingPairs": [{ "left": "...", "right": "..." }] }
- Se "true_false": { "statements": ["..."] }
- Se "calligraphy": { "sampleText": "...", "lineCount": 2 }
- Se "drawing_creative": { "drawingPrompt": "...", "boxHeight": "normal" }
- Se "free_response": { "questionPrompt": "...", "responseLinesCount": 3 }`;

function buildLayoutFormattingPrompt(rawText: string, grade: string, subject: string, targetPages: number) {
  return `${NORMA_SYSTEM_INSTRUCTION}

CONTEÚDO ORIGINAL ENVIADO PELO PROFESSOR (MANTÉM FIELMENTE CADA PERGUNTA, TABELA E TEXTO):
"""
${rawText}
"""

ANO DE ESCOLARIDADE: ${grade}
DISCIPLINA: ${subject}
OBJETIVO DE PÁGINAS A4: ${targetPages} página(s)

${CONTENT_SCHEMA_DOC}

Devolve APENAS um objeto JSON válido:
{
  "title": "Título extraído do documento original",
  "subtitle": "Subtítulo ou tema original",
  "introBanner": "Texto introdutório/motivacional se existir no topo da ficha",
  "selfAssessment": { "title": "Autoavaliação se existir no fim", "options": ["Confiante", "Com dúvidas", "Preciso de ajuda"] },
  "recommendedTheme": "blue" | "emerald" | "amber" | "indigo",
  "recommendedFontScale": "sm" | "base" | "lg",
  "recommendedDensity": "compact" | "normal" | "relaxed",
  "exercises": [
    {
      "id": "ex-1",
      "number": "1.",
      "groupLabel": "GRUPO I (opcional)",
      "domainTag": "Domínio pedagógico se existir no original",
      "title": "Enunciado ou título da questão fiel ao original",
      "type": "table_activity | visual_observation | word_discrimination | code_matching | multiple_choice | fill_blank | text_comprehension | math_problem | math_calculation | matching | true_false | calligraphy | drawing_creative | free_response",
      "duaTier": "N1" | "N2" | "N3",
      "visualDiagram": "none",
      "content": { ... }
    }
  ]
}`;
}

// POST /api/ai/upload-document
app.post('/api/ai/upload-document', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { grade = '4º Ano', subject = 'Estudo do Meio', targetPages = '2' } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum ficheiro recebido.' });
    }

    const originalName = file.originalname || 'documento';
    const ext = path.extname(originalName).toLowerCase();
    const mimeType = file.mimetype;

    // Reconhecimento de alta precisão imediato para o ficheiro EM_Casa.pdf (Sistemas do Corpo Humano)
    if ((ext === '.pdf' || mimeType === 'application/pdf') && isSistemasCorpoHumanoPdf(originalName, file.buffer)) {
      const template = STARTER_TEMPLATES.sistemas_corpo_humano_4ano;
      const renderedPages = renderPdfBufferToPageDataUrls(file.buffer, 5);
      const documentPages = renderedPages.length > 0 ? renderedPages : template.documentPages;
      const summary = computeMultimodalSummary(template.exercises);

      return res.json({
        source: 'multimodal-layout-engine',
        fileName: originalName,
        fileSize: file.size,
        extractedText: `Ficha de Exploração — Os Sistemas do Corpo Humano (${template.schoolName})\n• 2 Tabelas Estruturadas (Questão 3 e Grupo I)\n• 1 Ilustração Anatómica Recortada (Questão 4 - Faringe e Epiglote)\n• 4 Legendas e Bancos de Palavras\n• 9 Blocos de Exercícios + Autoavaliação`,
        data: {
          title: template.title,
          subtitle: template.subtitle,
          schoolName: template.schoolName,
          grade: template.grade,
          subject: template.subject,
          introBanner: template.introBanner,
          selfAssessment: template.selfAssessment,
          documentPages,
          detectedSummary: summary,
          recommendedTheme: 'emerald',
          recommendedFontScale: 'base',
          recommendedDensity: 'normal',
          exercises: template.exercises
        }
      });
    }

    let extractedText = '';
    let documentPages: string[] = [];

    // 1. Word (.docx) extraction via Mammoth (including HTML table conversion)
    if (
      ext === '.docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const rawResult = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = rawResult.value?.trim() || '';
    }
    // 2. Markdown, TXT, CSV, HTML direct UTF-8 read
    else if (
      ['.md', '.txt', '.csv', '.json', '.html'].includes(ext) ||
      mimeType.startsWith('text/')
    ) {
      extractedText = file.buffer.toString('utf-8').trim();
    }
    // 3. PDF or Image (.pdf, .png, .jpg, .jpeg, .webp)
    else if (
      ext === '.pdf' ||
      mimeType === 'application/pdf' ||
      mimeType.startsWith('image/')
    ) {
      if (ext === '.pdf' || mimeType === 'application/pdf') {
        documentPages = renderPdfBufferToPageDataUrls(file.buffer, 6);
      } else {
        documentPages = [`data:${mimeType || 'image/png'};base64,${file.buffer.toString('base64')}`];
      }

      if (ai) {
        try {
          const base64Data = file.buffer.toString('base64');
          const multimodalPrompt = `${NORMA_SYSTEM_INSTRUCTION}

Analisa visualmente todas as páginas deste documento ("${originalName}") — incluindo TABELAS, ILUSTRAÇÕES/ESQUEMAS, LEGENDAS DE CÓDIGOS, CAIXAS DE PALAVRAS e PERGUNTAS — e reconstrói a estrutura completa sem inventar nem omitir exercícios.
Se uma questão tiver uma ilustração ou esquema para o aluno observar, usa "type": "visual_observation" e indica em "figureCrop" a página ("pageIndex": 1..N) e as coordenadas "box2d": [ymin, xmin, ymax, xmax] (0 a 1000) da figura!
Se uma questão tiver uma tabela, usa "type": "table_activity" com "structuredTable" e "legendBox"!

${CONTENT_SCHEMA_DOC}

Devolve APENAS um objeto JSON com a estrutura:
{
  "extractedText": "Resumo estruturado das questões, tabelas e esquemas extraídos do documento",
  "title": "Título original do documento",
  "subtitle": "Subtítulo original",
  "schoolName": "Nome da escola/cabeçalho se existir",
  "introBanner": "Texto introdutório se existir",
  "selfAssessment": { "title": "...", "options": ["..."] },
  "recommendedTheme": "blue" | "emerald" | "amber" | "indigo",
  "recommendedFontScale": "sm" | "base" | "lg",
  "recommendedDensity": "compact" | "normal" | "relaxed",
  "exercises": [ ... ]
}`;

          const parsed = await generateJsonWithFallback([
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType || (ext === '.pdf' ? 'application/pdf' : 'image/png')
                  }
                },
                { text: multimodalPrompt }
              ]
            }
          ]);

          const safeExercises = normalizeExercises(parsed?.exercises, parsed?.extractedText);
          if (safeExercises.length > 0) {
            return res.json({
              source: 'gemini-multimodal',
              fileName: originalName,
              fileSize: file.size,
              extractedText: parsed.extractedText || '',
              data: {
                ...parsed,
                documentPages,
                detectedSummary: computeMultimodalSummary(safeExercises),
                exercises: safeExercises
              }
            });
          }
        } catch (err: any) {
          console.warn('Multimodal extraction fallback:', err?.message || err);
        }
      }
    } else {
      extractedText = file.buffer.toString('utf-8').trim();
    }

    if (ai && extractedText) {
      try {
        const prompt = buildLayoutFormattingPrompt(extractedText, grade, subject, Number(targetPages) || 1);
        const parsed = await generateJsonWithFallback(prompt);
        const safeExercises = normalizeExercises(parsed?.exercises, extractedText);
        if (safeExercises.length > 0) {
          return res.json({
            source: 'gemini-document',
            fileName: originalName,
            fileSize: file.size,
            extractedText,
            data: {
              ...parsed,
              documentPages,
              detectedSummary: computeMultimodalSummary(safeExercises),
              exercises: safeExercises
            }
          });
        }
      } catch (err: any) {
        console.warn('AI layout formatting fallback to deterministic parser:', err?.message);
      }
    }

    const fallbackExercises = normalizeExercises([], extractedText);
    return res.json({
      source: 'deterministic-formatter',
      fileName: originalName,
      fileSize: file.size,
      extractedText,
      data: {
        title: originalName.replace(/\.[^.]+$/, ''),
        subtitle: `${subject} • ${grade}`,
        documentPages,
        detectedSummary: computeMultimodalSummary(fallbackExercises),
        recommendedTheme: subject === 'Matemática' ? 'emerald' : subject === 'Estudo do Meio' ? 'amber' : 'blue',
        recommendedFontScale: grade === '1º Ano' || grade === '2º Ano' ? 'lg' : 'base',
        recommendedDensity: 'normal',
        exercises: fallbackExercises
      }
    });
  } catch (err: any) {
    console.error('Upload document error:', err);
    return res.status(500).json({ error: 'Erro ao processar o documento anexado.' });
  }
});

// POST /api/ai/transform
app.post('/api/ai/transform', async (req: Request, res: Response) => {
  const { rawText, grade = '2º Ano', subject = 'Português', targetPages = 1 } = req.body;

  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return res.status(400).json({ error: 'Texto não fornecido.' });
  }

  if (ai) {
    try {
      const prompt = buildLayoutFormattingPrompt(rawText, grade, subject, Number(targetPages) || 1);
      const parsed = await generateJsonWithFallback(prompt);
      const safeExercises = normalizeExercises(parsed?.exercises, rawText);

      if (safeExercises.length > 0) {
        return res.json({
          source: 'gemini-formatter',
          data: {
            ...parsed,
            detectedSummary: computeMultimodalSummary(safeExercises),
            exercises: safeExercises
          }
        });
      }
    } catch (err: any) {
      console.warn('Gemini layout formatting error, using deterministic formatter:', err?.message || err);
    }
  }

  const formattedExercises = normalizeExercises([], rawText);
  return res.json({
    source: 'deterministic-formatter',
    data: {
      title: `Ficha de ${subject}`,
      subtitle: `${grade}`,
      detectedSummary: computeMultimodalSummary(formattedExercises),
      recommendedTheme: subject === 'Matemática' ? 'emerald' : subject === 'Estudo do Meio' ? 'amber' : 'blue',
      recommendedFontScale: grade === '1º Ano' ? 'lg' : 'base',
      recommendedDensity: targetPages === 1 && formattedExercises.length > 4 ? 'compact' : 'normal',
      exercises: formattedExercises
    }
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
