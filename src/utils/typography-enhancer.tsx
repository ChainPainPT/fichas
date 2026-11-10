import React from 'react';

const PT_ACTION_VERBS = new Set([
  'lê',
  'leia',
  'observa',
  'assinala',
  'resolve',
  'calcula',
  'efetua',
  'arma',
  'liga',
  'completa',
  'preenche',
  'copia',
  'escreve',
  'desenha',
  'pinta',
  'ordena',
  'classifica',
  'identifica',
  'sublinha',
  'rodeia',
  'circunda',
  'explica',
  'responde',
  'descobre',
  'compara',
  'transforma',
  'reescreve',
  'indica',
  'regista'
]);

/**
 * Skill better-typography (#50) & iep-dl54-accommodation (#12):
 * Realça automaticamente os verbos de comando/ação nos enunciados originais do professor
 * sem alterar uma única palavra do conteúdo original.
 */
export function renderWithHighlightedVerbs(text: string, enabled: boolean = true): React.ReactNode {
  if (!enabled || !text) return text;

  const tokens = text.split(/(\s+)/);
  return tokens.map((token, idx) => {
    const cleanWord = token.replace(/[.,:;!?()"\[\]]/g, '').toLowerCase();
    if (PT_ACTION_VERBS.has(cleanWord)) {
      return (
        <strong
          key={idx}
          className="font-extrabold neuro-accent-text print:text-black underline decoration-2 underline-offset-3"
        >
          {token}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}
