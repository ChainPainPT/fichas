import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseRawTextToExercises,
  normalizeExercises,
  computeMultimodalSummary
} from './parser';
import { STARTER_TEMPLATES } from './pt-curriculum';

test('parseRawTextToExercises handles empty or whitespace text', () => {
  assert.deepEqual(parseRawTextToExercises(''), []);
  assert.deepEqual(parseRawTextToExercises('   \n  \t '), []);
});

test('parseRawTextToExercises detects math calculations with vertical operations', () => {
  const input = `1. Efetua as seguintes contas:
24 + 15
58 - 23
36 * 2`;

  const result = parseRawTextToExercises(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].type, 'math_calculation');
  assert.equal(result[0].number, '1.');
  assert.equal(result[0].content.calculations?.length, 3);
  assert.equal(result[0].content.calculations?.[0].term1, '24');
  assert.equal(result[0].content.calculations?.[0].operator, '+');
  assert.equal(result[0].content.calculations?.[0].term2, '15');
});

test('parseRawTextToExercises detects Markdown tables and converts them to table_activity', () => {
  const input = `1. Preenche a tabela dos sistemas do corpo humano:
| Órgão | Função (1-4) | Sistema (A-C) |
| Pulmões | | |
| Coração | | |`;

  const result = parseRawTextToExercises(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].type, 'table_activity');
  assert.deepEqual(result[0].content.structuredTable?.headers, [
    'Órgão',
    'Função (1-4)',
    'Sistema (A-C)'
  ]);
  assert.equal(result[0].content.structuredTable?.rows.length, 2);
});

test('parseRawTextToExercises detects inline word discrimination pairs [opção1 / opção2]', () => {
  const input = `1. Risca com um traço a palavra incorreta:
a) A pele e o aparelho urinário fazem parte do sistema [reprodutor / excretor].
b) A [epiglote / traqueia] fecha a entrada do aparelho respiratório.`;

  const result = parseRawTextToExercises(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].type, 'word_discrimination');
  assert.equal(result[0].content.discriminationSentences?.length, 2);
});

test('computeMultimodalSummary counts tables, cropped figures, legends, and choice blocks in EM_Casa template', () => {
  const emCasa = STARTER_TEMPLATES.sistemas_corpo_humano_4ano;
  const summary = computeMultimodalSummary(emCasa.exercises);
  assert.equal(summary.tablesCount, 2); // Questão 3 + Grupo I
  assert.equal(summary.figuresCount, 1); // Questão 4 (Cropped Pharynx/Epiglottis figure)
  assert.equal(summary.legendsCount, 4); // Questão 3, Grupo I, Grupo II (wordBank), Grupo IV (codeMatching)
  assert.equal(summary.choiceBlocksCount, 3); // Questão 1, Questão 2, Grupo III
});

test('normalizeExercises sanitizes malformed AI/upload payloads without crashing', () => {
  const malformedPayload = [
    {
      type: 'multiple_choice',
      title: 'Escolhe a opção certa:',
      question: 'Qual é a capital de Portugal?',
      options: [
        { label: 'A', text: 'Lisboa' },
        { label: 'B', text: 'Porto' },
        'Faro'
      ]
    },
    {
      type: 'unknown_ai_type',
      title: 'Lê e responde:',
      content: {
        readingText: 'Texto da ficha.',
        subQuestions: [{ question: '1. Onde se passa a história?' }, '2. Quem é a personagem?']
      }
    }
  ];

  const normalized = normalizeExercises(malformedPayload);
  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].type, 'multiple_choice');
  assert.deepEqual(normalized[0].content.options, ['Lisboa', 'Porto', 'Faro']);
  assert.equal(normalized[1].type, 'free_response');
  assert.deepEqual(normalized[1].content.subQuestions, [
    '1. Onde se passa a história?',
    '2. Quem é a personagem?'
  ]);
});
