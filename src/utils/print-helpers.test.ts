import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateExerciseHeight, calculatePageBudget, getFitToTargetRecommendation } from './print-helpers';
import { STARTER_TEMPLATES } from './pt-curriculum';

test('estimateExerciseHeight scales with density and font size', () => {
  const ex = STARTER_TEMPLATES.portugues_2ano.exercises[0]; // text comprehension
  const heightNormal = estimateExerciseHeight(ex, 'normal', 'base');
  const heightCompact = estimateExerciseHeight(ex, 'compact', 'sm');
  const heightRelaxed = estimateExerciseHeight(ex, 'relaxed', 'lg');

  assert.ok(heightCompact < heightNormal, 'Compact height must be less than normal');
  assert.ok(heightRelaxed > heightNormal, 'Relaxed height must be greater than normal');
});

test('calculatePageBudget computes realistic page count and distribution', () => {
  const config = STARTER_TEMPLATES.estudo_do_meio_1ano;
  const budget = calculatePageBudget(config);

  assert.ok(budget.estimatedPageCount >= 1);
  assert.ok(budget.exerciseHeights.length === config.exercises.length);
  assert.ok(budget.recommendation);
});

test('getFitToTargetRecommendation suggests tighter settings for single page', () => {
  const exercises = STARTER_TEMPLATES.matematica_3ano.exercises;
  const rec1Page = getFitToTargetRecommendation(exercises, 1);
  const rec2Pages = getFitToTargetRecommendation(exercises, 2);

  assert.equal(rec1Page.spacing, 'compact');
  assert.equal(rec2Pages.spacing, 'normal');
});
