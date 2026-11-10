import { NeuroPaletteId, WorksheetConfig } from '../types/worksheet';

export interface NeuroPaletteSpec {
  id: NeuroPaletteId;
  name: string;
  shortName: string;
  benefit: string;
  recommendedFor: string;
  paperBg: string;       // Fundo geral da folha A4 (zero branco-hospitalar ofuscante)
  cardBg: string;        // Superfície interna dos cartões de exercício
  surfaceTint: string;   // Fundo suave para caixas de leitura, dicas e cabeçalho
  borderCalm: string;    // Contorno suave sem contraste agressivo
  accentCalm: string;    // Cor de destaque dessaturada (etiquetas, números e verbos)
  accentSoftBg: string;  // Fundo subtil para etiquetas DUA
  textPrimary: string;   // Cor de texto principal (grafite escuro em vez de #000 puro no ecrã)
  themeColor: WorksheetConfig['themeColor'];
}

export const NEURO_PALETTES: Record<NeuroPaletteId, NeuroPaletteSpec> = {
  creme_aveia: {
    id: 'creme_aveia',
    name: 'Creme Aveia & Azul Sereno',
    shortName: 'Creme Aveia',
    benefit: 'Elimina o encandeamento do fundo branco puro e reduz a fadiga ocular.',
    recommendedFor: 'Leitura prolongada, Dislexia & Síndrome de Irlen',
    paperBg: '#FDFBF7',
    cardBg: '#FFFEFC',
    surfaceTint: '#F4F1EA',
    borderCalm: '#64748B',
    accentCalm: '#2B4C7E',
    accentSoftBg: '#EBF0F7',
    textPrimary: '#1E293B',
    themeColor: 'blue'
  },
  salvia_zen: {
    id: 'salvia_zen',
    name: 'Sálvia Suave & Eucalipto',
    shortName: 'Sálvia Zen',
    benefit: 'Tom botânico dessaturado que promove regulação emocional e foco calmo.',
    recommendedFor: 'PHDA, Autismo (PEA) & Redução de Ansiedade em Testes',
    paperBg: '#F6FAF7',
    cardBg: '#FCFDFC',
    surfaceTint: '#EAF2ED',
    borderCalm: '#52796F',
    accentCalm: '#2D5A4C',
    accentSoftBg: '#E3EFE8',
    textPrimary: '#1C2E28',
    themeColor: 'emerald'
  },
  areia_duna: {
    id: 'areia_duna',
    name: 'Areia da Ria & Terracota Suave',
    shortName: 'Areia Quente',
    benefit: 'Temperatura cromática acolhedora que suaviza o contraste figura-fundo.',
    recommendedFor: '1.º / 2.º Ano, Sensibilidade Visual & Conforto Sensorial',
    paperBg: '#FBF7F0',
    cardBg: '#FFFDF9',
    surfaceTint: '#F3ECE1',
    borderCalm: '#786B5E',
    accentCalm: '#845034',
    accentSoftBg: '#F4E8DF',
    textPrimary: '#29221C',
    themeColor: 'amber'
  },
  nevoeiro_nordico: {
    id: 'nevoeiro_nordico',
    name: 'Nevoeiro Nórdico & Ardósia',
    shortName: 'Nevoeiro Foco',
    benefit: 'Fundo azul-acinzentado neutro que favorece a concentração analítica.',
    recommendedFor: 'Matemática, Raciocínio Lógico & Grelhas C.R.A.',
    paperBg: '#F6F9FC',
    cardBg: '#FCFDFE',
    surfaceTint: '#EBF1F6',
    borderCalm: '#5B7083',
    accentCalm: '#334E68',
    accentSoftBg: '#E4ECF2',
    textPrimary: '#1E293B',
    themeColor: 'blue'
  },
  lavanda_serena: {
    id: 'lavanda_serena',
    name: 'Malva Pálido & Lavanda Seca',
    shortName: 'Lavanda Calma',
    benefit: 'Baixo estímulo sensorial para atividades de expressão e interpretação.',
    recommendedFor: 'Escrita Criativa, Estudo do Meio & Hipersensibilidade Visual',
    paperBg: '#FAF8FC',
    cardBg: '#FEFCFF',
    surfaceTint: '#F1ECF6',
    borderCalm: '#6E6278',
    accentCalm: '#564268',
    accentSoftBg: '#EDE6F4',
    textPrimary: '#251E2E',
    themeColor: 'indigo'
  },
  algodao_neutro: {
    id: 'algodao_neutro',
    name: 'Algodão Cru & Grafite Macio',
    shortName: 'Algodão Puro',
    benefit: 'Zero distração cromática com contraste suave (sem preto retinto no ecrã).',
    recommendedFor: 'Minimalismo Sensorial & Pré-visualização de Fotocópia',
    paperBg: '#F8F8F6',
    cardBg: '#FFFFFF',
    surfaceTint: '#EFEFE9',
    borderCalm: '#57534E',
    accentCalm: '#3F3F46',
    accentSoftBg: '#E7E5E4',
    textPrimary: '#27272A',
    themeColor: 'mono'
  }
};

export const NEURO_PALETTE_LIST: NeuroPaletteSpec[] = Object.values(NEURO_PALETTES);

export function getNeuroPalette(id?: NeuroPaletteId): NeuroPaletteSpec {
  if (id && NEURO_PALETTES[id]) {
    return NEURO_PALETTES[id];
  }
  return NEURO_PALETTES.creme_aveia;
}
