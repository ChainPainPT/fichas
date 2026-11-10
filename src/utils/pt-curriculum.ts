import { WorksheetConfig } from '../types/worksheet';

export const STARTER_TEMPLATES: Record<string, WorksheetConfig> = {
  sistemas_corpo_humano_4ano: {
    id: 'template-em-casa-4ano',
    schoolName: 'EB DA LEJANA • FARO • ESTUDO DO MEIO 4.º ANO • TURMA 41',
    subject: 'Estudo do Meio',
    grade: '4º Ano',
    term: 'Turma 41 • Exploração Científica & Sistemas do Corpo Humano',
    title: 'Ficha de Exploração — Os Sistemas do Corpo Humano',
    subtitle: 'Caminho do Ar e dos Alimentos, Funções dos Órgãos, Epiglote e Hábitos de Saúde',
    introBanner:
      'Olá, pequenos exploradores! Hoje vamos seguir as pistas dentro do nosso próprio corpo, como se estivéssemos a navegar pela Ria Formosa, mas por dentro de nós! Vamos descobrir os caminhos que o ar e a comida fazem para nos dar energia e manter-nos saudáveis, como os nossos golfinhos da Ria.',
    documentPages: [
      '/assets/aistudio/em_casa_page1.png',
      '/assets/aistudio/em_casa_page2.png',
      '/assets/aistudio/em_casa_page3.png',
      '/assets/aistudio/em_casa_page4.png',
      '/assets/aistudio/em_casa_page5.png'
    ],
    detectedSummary: {
      tablesCount: 2,
      figuresCount: 1,
      legendsCount: 4,
      choiceBlocksCount: 3,
      fixedPageSplitsCount: 2
    },
    selfAssessment: {
      title: 'Autoavaliação do Explorador — Como me senti nesta missão pelo Corpo Humano?',
      options: ['😊 Confiante', '🤔 Com algumas dúvidas', '🙋 Preciso de ajuda']
    },
    studentFields: {
      showName: true,
      showDate: true,
      showGradeTurma: true,
      showNumber: true
    },
    evaluationMode: 'qualitative',
    showDuaRubric: true,
    showTeacherSignature: true,
    showGuardianSignature: true,
    themeColor: 'emerald',
    neuroPalette: 'salvia_zen',
    fontFamily: 'lexend',
    fontSizeScale: 'base',
    spacingDensity: 'normal',
    monochromePrintMode: false,
    showHolePunchGuide: true,
    accommodationProfile: 'standard',
    highlightActionVerbs: true,
    exercises: [
      {
        id: 'em4-q1',
        number: '1.',
        title: 'Questão 1 — Caminho do Ar vs. Caminho dos Alimentos',
        domainTag: 'Compreensão Científica',
        type: 'multiple_choice',
        duaTier: 'N1',
        content: {
          contextText:
            'O pequeno Martim adora os doces finos de amêndoa da pastelaria em Faro. Ao comer um, ele engasgou-se e tossiu muito.',
          question: 'O que aconteceu, muito provavelmente, para o Martim se engasgar? Assinala a opção correta:',
          options: [
            'Um pedacinho de doce entrou no estômago em vez de ir para os pulmões.',
            'Um pedacinho de doce entrou no tubo do ar (traqueia) em vez de ir para o tubo da comida (esófago).',
            'O doce foi para o coração e isso fez o Martim tossir.',
            'O ar que ele respirou entrou no tubo da comida.'
          ]
        }
      },
      {
        id: 'em4-q2',
        number: '2.',
        title: 'Questão 2 — Esforço Físico e Circulação Sanguínea',
        domainTag: 'Raciocínio Fisiológico',
        type: 'multiple_choice',
        duaTier: 'N1',
        content: {
          contextText:
            'Durante o esforço físico intenso na pista de atletismo de Faro, o sangue da Francisca começou a circular com maior velocidade.',
          question: 'Qual é a explicação científica para o coração bater mais depressa durante a corrida?',
          options: [
            'O coração bate mais depressa para empurrar o bolo alimentar do estômago para o intestino delgado.',
            'Os músculos em esforço precisam de mais oxigénio e nutrientes, logo o coração aumenta o ritmo para acelerar a entrega pelo sangue.',
            'Os pulmões deixam de funcionar e o coração tem de bombear ar diretamente para as pernas da atleta.',
            'O sangue precisa de ficar parado nas artérias para evitar que o corpo perca água através do suor.'
          ]
        }
      },
      {
        id: 'em4-q3',
        number: '3.',
        title: 'Questão 3 — Associação de Órgãos, Funções e Sistemas',
        domainTag: 'Organização de Dados',
        type: 'table_activity',
        duaTier: 'N2',
        content: {
          contextText:
            'A Francisca foi correr na Ria Formosa com a cadela Lejaninha 🐕. Enquanto corria, sentia o ar a entrar e a sair dos seus pulmões com força, e o seu coração batia mais depressa. Preenche a tabela, ligando cada órgão à sua função (números 1 a 4) e ao sistema a que pertence (letras A a C):',
          sideBySideLegendAndTable: true,
          legendBox: {
            title: 'Funções Principais (Números)',
            items: [
              '[ 1 ] Responsável por levar o ar para dentro e para fora do corpo.',
              '[ 2 ] Órgão que bombeia o sangue para todo o corpo.',
              '[ 3 ] Tubo por onde a comida passa da boca até ao estômago.',
              '[ 4 ] Processa os alimentos para o corpo absorver os nutrientes.'
            ],
            badgeTitle: 'Sistemas do Corpo (Letras)',
            badges: [
              '[ A ] S. Respiratório',
              '[ B ] S. Digestivo',
              '[ C ] S. Circulatório'
            ]
          },
          structuredTable: {
            headers: ['Órgão', 'Função (1–4)', 'Sistema (A–C)'],
            rows: [
              ['Pulmões', '', ''],
              ['Boca', '', ''],
              ['Esófago', '', ''],
              ['Estômago', '', ''],
              ['Coração', '', '']
            ]
          }
        }
      },
      {
        id: 'em4-q4',
        number: '4.',
        title: 'Questão 4 — A Encruzilhada da Faringe e o Papel da Epiglote',
        domainTag: 'Observação & Causa-Efeito',
        type: 'visual_observation',
        duaTier: 'N2',
        content: {
          contextText:
            'Observa a imagem abaixo, que representa a boca, as fossas nasais e a faringe. O que é a epiglote e qual é a sua importância para evitar que a comida vá para o tubo do ar?',
          figureCrop: {
            pageIndex: 3,
            box2d: [121, 95, 331, 502],
            caption: 'Esquema Original: Fossas Nasais, Faringe, Epiglote, Traqueia e Esófago'
          },
          observationHeading: '✏️ A tua explicação científica (Causa e Efeito):',
          scaffoldPrompt: '"Isto acontece porque a epiglote é [Causa], logo [Efeito]."',
          responseLinesCount: 4
        }
      },
      {
        id: 'em4-g1',
        number: '5.',
        groupLabel: 'GRUPO I',
        title: 'A Engenharia dos Sistemas do Corpo Humano',
        domainTag: 'Visão Sistémica',
        type: 'table_activity',
        duaTier: 'N2',
        content: {
          contextText:
            '1. Associa cada conjunto de órgãos da Coluna X à sua respetiva função principal na Coluna Y e ao Sistema do Corpo Humano (A a E) a que pertence, preenchendo a Caixa de Respostas em baixo:',
          sideBySideLegendAndTable: false,
          legendBox: {
            badges: [
              '[ A ] Sistema Digestivo',
              '[ B ] Sistema Respiratório',
              '[ C ] Sistema Circulatório',
              '[ D ] Sistema Excretor',
              '[ E ] Sistema Reprodutor'
            ]
          },
          structuredTable: {
            headers: ['Coluna X (Órgãos Principais)', 'Coluna Y (Funções Principais no Organismo)'],
            rows: [
              [
                '1. Coração e Vasos Sanguíneos •',
                '• [ 1 ] Transforma os alimentos em nutrientes para alimentar todas as células.'
              ],
              [
                '2. Estômago e Intestinos •',
                '• [ 2 ] Capta o oxigénio do ar e liberta o dióxido de carbono.'
              ],
              [
                '3. Pulmões e Vias Respiratórias •',
                '• [ 3 ] Transporta o sangue, oxigénio e nutrientes por todo o corpo.'
              ],
              [
                '4. Rins e Vias Urinárias •',
                '• [ 4 ] Filtra o sangue e elimina os resíduos líquidos através da urina e do suor.'
              ],
              [
                '5. Órgãos Reprodutores •',
                '• [ 5 ] Assegura a continuidade da espécie humana, gerando novos seres.'
              ]
            ]
          },
          answerCards: [
            { title: '1. Coração', fields: ['Função:', 'Sistema:'] },
            { title: '2. Estômago', fields: ['Função:', 'Sistema:'] },
            { title: '3. Pulmões', fields: ['Função:', 'Sistema:'] },
            { title: '4. Rins', fields: ['Função:', 'Sistema:'] },
            { title: '5. Órgãos Rep.', fields: ['Função:', 'Sistema:'] }
          ]
        }
      },
      {
        id: 'em4-g2',
        number: '6.',
        groupLabel: 'GRUPO II',
        title: 'O Diário de Bordo da Turma 41 — Processos Fisiológicos',
        domainTag: 'Vocabulário Científico',
        type: 'fill_blank',
        duaTier: 'N2',
        content: {
          contextText:
            'Completa as frases seguintes escolhendo as palavras corretas da Caixa de Palavras de Apoio (atenção: há duas palavras intrusas que não vais precisar de usar!):',
          wordBank: [
            'rins',
            'alvéolos',
            'quimo',
            'coração',
            'fígado',
            'estômago',
            'circulatório',
            'respiratório',
            'digestivo',
            'excretor'
          ],
          sentencesWithBlanks: [
            'a) O Francisco Luz e os colegas da Turma 41 aprenderam na aula que os ____________ são dois órgãos em forma de feijão que filtram o sangue, pertencendo ao Sistema ____________.',
            'b) No interior dos pulmões, a troca do ar que respiramos acontece em pequenas bolsas chamadas ____________ pulmonares, que fazem parte do Sistema ____________.',
            'c) Depois de mastigarmos bem a comida na hora do lanche, o bolo alimentar chega ao estômago, mistura-se com o suco gástrico e transforma-se numa papa chamada ____________.',
            'd) O órgão muscular que bate sem parar no peito de cada aluno para bombear o sangue chama-se ____________ e pertence ao Sistema ____________.'
          ]
        }
      },
      {
        id: 'em4-g3',
        number: '7.',
        groupLabel: 'GRUPO III',
        title: 'Detetive da Ciência — Discriminação de Conceitos',
        domainTag: 'Pensamento Crítico',
        type: 'word_discrimination',
        duaTier: 'N2',
        content: {
          discriminationExample:
            'Instrução: Lê atentamente cada frase. Em cada par de conceitos destacados, risca com um traço a palavra INCORRETA para que a afirmação fique cientificamente verdadeira (exemplo: A digestão começa na boca / traqueia).',
          discriminationSentences: [
            'a) A pele e o aparelho urinário fazem parte do sistema [reprodutor / excretor], sendo fundamentais para [eliminar / produzir] as substâncias de que o corpo não precisa.',
            'b) Em dias de muito calor na nossa escola em Faro, a pele ajuda a regular a temperatura do corpo eliminando água e sais minerais através do [suor / rim].',
            'c) Quando engolimos os alimentos, a [epiglote / traqueia] funciona como uma portinhola inteligente que fecha a entrada do aparelho respiratório para a comida descer pelo [esófago / pulmão].',
            'd) A passagem definitiva dos nutrientes já digeridos para a corrente sanguínea (a absorção) acontece principalmente no [estômago / intestino delgado].'
          ]
        }
      },
      {
        id: 'em4-g4',
        number: '8.',
        groupLabel: 'GRUPO IV',
        title: 'Hábitos de Saúde e Cidadania (Saúde e Proteção Civil)',
        domainTag: 'Vida Saudável em Faro',
        type: 'code_matching',
        duaTier: 'N2',
        content: {
          contextText: '4. Relaciona cada cuidado de saúde diário com o sistema do corpo humano que estamos a proteger:',
          codeMatching: {
            legendCodes: [
              'A — Sistema Respiratório',
              'B — Sistema Circulatório',
              'C — Sistema Digestivo',
              'D — Sistema Excretor'
            ],
            items: [
              '1. Beber muita água ao longo do dia e usar protetor solar na praia da Ilha de Faro para proteger a pele.',
              '2. Praticar exercício físico regular e evitar comer alimentos com excesso de sal e gorduras saturadas.',
              '3. Mastigar devagar os alimentos, comer legumes frescos e escovar os dentes após as refeições.',
              '4. Respirar sempre pelo nariz (que aquece e filtra o ar) e evitar ambientes com fumo de tabaco.'
            ]
          }
        }
      },
      {
        id: 'em4-desafio',
        number: '9.',
        title: '🚀 Super Desafio dos Exploradores',
        domainTag: 'Síntese Científica',
        type: 'free_response',
        duaTier: 'N3',
        content: {
          questionPrompt:
            'Porque é que não devemos tomar banho no mar da Ilha de Faro com uma mudança brusca de temperatura logo após uma refeição muito pesada? Como trabalham em equipa o Sistema Digestivo e o Sistema Circulatório nesse momento?',
          responseLinesCount: 2
        }
      }
    ]
  },

  portugues_2ano: {
    id: 'template-pt-2',
    schoolName: 'ESCOLA BÁSICA DA LEJANA — FARO',
    subject: 'Português',
    grade: '2º Ano',
    term: 'Ano Letivo 2025/2026 • Layout DUA & Zorzi',
    title: 'Ficha de Leitura, Gramática e Escrita (Céu · Relva · Terra)',
    subtitle: 'Compreensão de texto (Medida Zorzi), correspondência e caligrafia em pauta tripla',
    studentFields: {
      showName: true,
      showDate: true,
      showGradeTurma: true,
      showNumber: true
    },
    evaluationMode: 'qualitative',
    showDuaRubric: true,
    showTeacherSignature: true,
    showGuardianSignature: true,
    themeColor: 'blue',
    neuroPalette: 'creme_aveia',
    fontFamily: 'lexend',
    fontSizeScale: 'base',
    spacingDensity: 'normal',
    monochromePrintMode: false,
    showHolePunchGuide: true,
    accommodationProfile: 'standard',
    highlightActionVerbs: true,
    exercises: [
      {
        id: 'pt2-ex1',
        number: '1.',
        title: 'Lê o texto com muita atenção:',
        type: 'text_comprehension',
        points: '35%',
        duaTier: 'N1',
        duaHint: 'Sublinha a lápis no texto o lugar onde vive o esquilo antes de responderes.',
        visualDiagram: 'thinking_map_bubble',
        content: {
          readingTitle: 'O Esquilo Saltitão e as Nozes de Outono',
          readingAuthor: 'Caderno de Alfabetização • 1.º Ciclo',
          readingText: 'O Saltitão é um pequeno esquilo castanho de cauda felpuda. Vive no cimo de um carvalho centenário no Parque da Cidade.\nQuando o Outono chega e as folhas começam a cair douradas no chão, o Saltitão corre apressado à procura de bolotas e nozes para guardar no seu esconderijo secreto.',
          subQuestions: [
            'Onde vive o esquilo Saltitão?',
            'O que faz o Saltitão quando chega o Outono?'
          ]
        }
      },
      {
        id: 'pt2-ex2',
        number: '2.',
        title: 'Assinala com uma cruz (X) a opção correta sobre o texto:',
        type: 'multiple_choice',
        points: '20%',
        duaTier: 'N1',
        content: {
          question: 'Que frutos secos guarda o esquilo Saltitão no seu esconderijo?',
          options: [
            'Morangos e cerejas',
            'Bolotas e nozes',
            'Laranjas e figos',
            'Maçãs e peras'
          ]
        }
      },
      {
        id: 'pt2-ex3',
        number: '3.',
        title: 'Liga com a régua cada palavra ao seu antónimo (o contrário):',
        type: 'matching',
        points: '25%',
        duaTier: 'N2',
        content: {
          matchingPairs: [
            { left: 'pequeno', right: 'grande' },
            { left: 'apressado', right: 'calmo' },
            { left: 'subir', right: 'descer' },
            { left: 'dia', right: 'noite' }
          ]
        }
      },
      {
        id: 'pt2-ex4',
        number: '4.',
        title: 'Copia a frase para a pauta tripla (Céu · Relva · Terra) com a tua melhor letra:',
        type: 'calligraphy',
        points: '20%',
        duaTier: 'N2',
        content: {
          sampleText: 'O esquilo Saltitão guarda as nozes no carvalho.',
          pautaType: 'dupla',
          lineCount: 2
        }
      }
    ]
  },

  matematica_3ano: {
    id: 'template-mat-3',
    schoolName: 'ESCOLA BÁSICA DA LEJANA — FARO',
    subject: 'Matemática',
    grade: '3º Ano',
    term: 'Ano Letivo 2025/2026 • C.R.A. Singapura & IAVE',
    title: 'Ficha de Resolução de Problemas C.R.A. e Cálculo Tabular',
    subtitle: 'Algarismos tabulares (tabular-nums), quadrícula de 5mm e esquemas vetoriais',
    studentFields: {
      showName: true,
      showDate: true,
      showGradeTurma: true,
      showNumber: true
    },
    evaluationMode: 'qualitative',
    showDuaRubric: true,
    showTeacherSignature: true,
    showGuardianSignature: true,
    themeColor: 'emerald',
    neuroPalette: 'nevoeiro_nordico',
    fontFamily: 'lexend',
    fontSizeScale: 'base',
    spacingDensity: 'normal',
    monochromePrintMode: false,
    showHolePunchGuide: true,
    accommodationProfile: 'standard',
    highlightActionVerbs: true,
    exercises: [
      {
        id: 'mat3-ex1',
        number: '1.',
        title: 'Resolve com atenção o problema da banca da feira:',
        type: 'math_problem',
        points: '30 pts',
        duaTier: 'N2',
        duaHint: 'Preenche o modelo em barra (Todo / Partes) antes de fazeres as operações.',
        visualDiagram: 'bar_model',
        content: {
          problemPrompt: 'O senhor Manuel levou para a feira de Faro 145 laranjas do Algarve e 86 maçãs. No final do dia conseguiu vender 172 peças de fruta ao todo. Quantas frutas sobraram na banca do senhor Manuel?',
          givenDataPrompt: 'Dados / Esquema C.R.A.',
          operationPrompt: 'Operações na Quadrícula (5mm)',
          answerPrompt: 'Resposta completa'
        }
      },
      {
        id: 'mat3-ex2',
        number: '2.',
        title: 'Arma e efetua as operações alinhando Centenas, Dezenas e Unidades:',
        type: 'math_calculation',
        points: '30 pts',
        duaTier: 'N1',
        layoutCols: 3,
        visualDiagram: 'mab_blocks',
        content: {
          calculations: [
            { operation: '348 + 125 =', term1: '348', operator: '+', term2: '125', vertical: true, showGrid: true },
            { operation: '652 - 238 =', term1: '652', operator: '-', term2: '238', vertical: true, showGrid: true },
            { operation: '42 × 3 =', term1: '42', operator: '×', term2: '3', vertical: true, showGrid: true }
          ]
        }
      },
      {
        id: 'mat3-ex3',
        number: '3.',
        title: 'Assinala com V (Verdadeiro) ou F (Falso) as afirmações sobre figuras geométricas:',
        type: 'true_false',
        points: '20 pts',
        duaTier: 'N2',
        content: {
          statements: [
            'O quadrado tem 4 lados exatamente com o mesmo comprimento.',
            'O triângulo tem 4 vértices.',
            'O círculo não tem lados retos nem vértices.',
            'O retângulo tem lados opostos paralelos e iguais.'
          ]
        }
      },
      {
        id: 'mat3-ex4',
        number: '4.',
        title: 'Assinala a resposta correta no desafio da reta numérica:',
        type: 'multiple_choice',
        points: '20 pts',
        duaTier: 'N3',
        duaHint: 'Pensa primeiro no dobro de 25 e depois soma uma centena.',
        visualDiagram: 'number_line',
        content: {
          question: 'Sou igual à soma de uma centena com o dobro de 25. Que número sou eu?',
          options: [
            '125',
            '150',
            '250',
            '175'
          ]
        }
      }
    ]
  },

  estudo_do_meio_1ano: {
    id: 'template-edm-1',
    schoolName: 'ESCOLA BÁSICA DA LEJANA — FARO',
    subject: 'Estudo do Meio',
    grade: '1º Ano',
    term: 'Ano Letivo 2025/2026 • Aquário Turma 41 & Ria Formosa',
    title: 'Ficha sobre os Seres Vivos, a Ria Formosa e os Cinco Sentidos',
    subtitle: 'Exploração da biodiversidade local e hábitos de vida saudável',
    studentFields: {
      showName: true,
      showDate: true,
      showGradeTurma: true,
      showNumber: true
    },
    evaluationMode: 'faces',
    showDuaRubric: true,
    showTeacherSignature: true,
    showGuardianSignature: true,
    themeColor: 'amber',
    neuroPalette: 'areia_duna',
    fontFamily: 'andika',
    fontSizeScale: 'lg',
    spacingDensity: 'relaxed',
    monochromePrintMode: false,
    showHolePunchGuide: true,
    accommodationProfile: 'standard',
    highlightActionVerbs: true,
    exercises: [
      {
        id: 'edm1-ex1',
        number: '1.',
        title: 'Liga com a régua cada órgão do corpo ao sentido correspondente:',
        type: 'matching',
        points: '35%',
        duaTier: 'N1',
        content: {
          matchingPairs: [
            { left: 'Olhos 👀', right: 'Visão (ver cores e formas)' },
            { left: 'Ouvidos 👂', right: 'Audição (ouvir músicas e sons)' },
            { left: 'Nariz 👃', right: 'Olfato (cheirar flores e maresia)' },
            { left: 'Língua 👅', right: 'Paladar (saborear a comida)' },
            { left: 'Mãos e Pele ✋', right: 'Tato (sentir o quente e o macio)' }
          ]
        }
      },
      {
        id: 'edm1-ex2',
        number: '2.',
        title: 'Completa as frases com a ajuda do banco de palavras:',
        type: 'fill_blank',
        points: '30%',
        duaTier: 'N2',
        visualDiagram: 'thinking_map_tree',
        content: {
          wordBank: ['dentes', 'água', 'mãos', 'fruta'],
          sentencesWithBlanks: [
            'Antes das refeições devo sempre lavar as ________ .',
            'Depois de comer devo escovar os meus ________ .',
            'Para crescer forte devo beber bastante ________ e comer ________ .'
          ]
        }
      },
      {
        id: 'edm1-ex3',
        number: '3.',
        title: 'Desenha e pinta um cavalo-marinho da Ria Formosa no seu habitat:',
        type: 'drawing_creative',
        points: '35%',
        duaTier: 'N3',
        content: {
          drawingPrompt: 'Desenha as algas verdes, a água cristalina e o cavalo-marinho.',
          boxHeight: 'normal'
        }
      }
    ]
  }
};
