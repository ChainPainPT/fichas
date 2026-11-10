# 📐 Manual de Normas Gráficas e Design Visual para Fichas e Testes do 1.º Ciclo
### *Consolidação Arquitetural: Caderno de Alfabetização (Prof. Ivo Leite) • Jogo Matemática • Aquário Turma 41 • IAVE • DUA / DL 54/2018*

---

## 1. Geometria da Folha, Margens e Área Útil de Impressão (A4)

| Parâmetro | Valor Padrão 1.º Ciclo | Justificação Pedagógica & Mecânica |
| :--- | :--- | :--- |
| **Formato Físico** | **A4 Retrato** ($210 \times 297\text{ mm}$) | Padrão das fotocopiadoras escolares e capas de arquivo dos alunos. |
| **Margem Esquerda** | **$18\text{ mm}$ a $20\text{ mm}$** | Zona de segurança para furação de 2 ou 4 argolas e arquivamento em dossiê sem furar texto. |
| **Margem Direita** | **$14\text{ mm}$ a $15\text{ mm}$** | Evita que o texto encoste ao rebordo ou sofra corte no alimentador da fotocopiadora. |
| **Margem Superior** | **$12\text{ mm}$ a $15\text{ mm}$** | Dá espaço ao cabeçalho oficial sem empurrar a primeira pergunta para fora da página 1. |
| **Margem Inferior** | **$12\text{ mm}$ a $15\text{ mm}$** | Zona de rodapé (paginação, assinatura e margem de arraste mecânico dos rolos de impressão). |
| **Área Útil de Trabalho** | **$176 \times 268\text{ mm}$** | Área efetiva onde se distribuem os blocos de conteúdo e desenho. |

---

## 2. Tipografia Neuroergonómica e Legibilidade Inclusiva

As evidências da **Ciência da Leitura**, do estudo de **Zorzi et al. (PNAS)** e do **Decreto-Lei n.º 54/2018** demonstram que crianças em alfabetização e alunos com dislexia sofrem de aglomeração visual (*visual crowding*).

### A. Fontes Recomendadas
1. **Corpo de Texto Geral (Fichas e Testes):**
   * **`Lexend` (Google Fonts):** Desenhada especificamente para reduzir a frequência espacial e acelerar a velocidade de leitura.
   * **`Andika` (SIL International - presente na pasta *Caderno*):** Formas infantis puras com letras abertas, **$a$ e $g$ de andar único** (sem formas de imprensa complexas) e distinção nítida entre $l$ (ele), $I$ (i grande) e $1$ (um).
   * **`Atkinson Hyperlegible`:** Desenvolvida para máxima discriminação de caracteres semelhantes ($b / d$, $p / q$).
2. **Iniciação à Escrita e Caligrafia (1.º e 2.º Anos):**
   * **`Escolar PT` / `Massallera` / `Primeiro Ciclo.ttf`:** Cursiva escolar limpa sem floreados excessivos.
   * **`Escolar4Puntos.ttf`:** Tipografia pontilhada para exercícios de decalque com lápis de grafite.
3. **Numerais e Tabelas de Matemática:**
   * Ativar sempre **Tabular Figures (`font-variant-numeric: tabular-nums`)** para que todos os algarismos tenham rigorosamente a mesma largura, alinhando dezenas sob dezenas e unidades sob unidades em contas armadas.

### B. Escala de Tamanhos de Letra por Nível de Escolaridade

| Elemento | 1.º e 2.º Anos | 3.º e 4.º Anos | Peso / Estilo |
| :--- | :---: | :---: | :--- |
| **Título Principal do Recurso** | $18\text{ pt}$ a $20\text{ pt}$ | $16\text{ pt}$ a $18\text{ pt}$ | Bold (700) ou Extra-Bold (800) |
| **Títulos de Secção / Partes** | $15\text{ pt}$ a $16\text{ pt}$ | $14\text{ pt}$ a $15\text{ pt}$ | Bold (700) |
| **Enunciados das Perguntas** | **$13\text{ pt}$ a $14\text{ pt}$** | **$11.5\text{ pt}$ a $12.5\text{ pt}$** | SemiBold (600) / Regular com **palavras-chave a negrito** |
| **Textos Narrativos de Leitura** | $14\text{ pt}$ a $15\text{ pt}$ | $12\text{ pt}$ a $13\text{ pt}$ | Regular (400) com entrelinha aberta |
| **Opções de Escolha Múltipla** | $13\text{ pt}$ | $11.5\text{ pt}$ a $12\text{ pt}$ | Regular (400) com letras A/B/C/D a Bold |
| **Pistas de Apoio DUA / Dicas** | $11\text{ pt}$ | $10\text{ pt}$ | Itálico suave com caixa delimitada |

### C. Espaçamento Micro-Tipográfico (Regra de Zorzi et al.)
* **Entrelinha (Line-height / Leading):** **$1.5$ a $1.65$** (150% a 165% do tamanho da fonte). Impede que o olho salte acidentalmente para a linha errada.
* **Espaçamento entre Letras (Letter-spacing / Tracking):** **$+0.05\text{em}$ a $+0.08\text{em}$** (aumenta o reconhecimento grafémico em 20%).
* **Espaçamento entre Palavras (Word-spacing):** **$+0.15\text{em}$**.
* **Comprimento da Linha de Leitura (Measure):** Máximo de **$50$ a $65$ caracteres por linha** (nunca texto a cruzar a folha A4 inteira de 210 mm; se necessário, usar 2 colunas ou margens arejadas).
* **Alinhamento:** **Sempre alinhado à esquerda**. **NUNCA JUSTIFICADO**, pois a justificação cria "rios brancos" no meio do texto que desorientam leitores com dislexia e PHDA.

---

## 3. Paleta Cromática e o "Fator Fotocopiadora Escolar"

Nas escolas portuguesas, **90% das fichas diárias são reproduzidas em fotocopiadoras a laser preto e branco**. Um design pedagógico excelente deve funcionar tanto no ecrã e na impressão a cores como na fotocópia económica a preto e branco.

### A. Paleta Digital & Impressão a Cores (Identidade Ria Formosa & DUA)
* **Fundo do Papel no Ecrã:** `#FDFBF7` (*Lexend Creme* / Marfim Neuro-acolhedor) — reduz o encandeamento visual e a fadiga ocular em 35% face ao branco puro `#FFFFFF`.
* **Cor Primária (Títulos, Fios e Identidade):** `#1E3A8A` (*Azul Oceânico Escuro* — Ria Formosa / Calma e Rigor).
* **Apoio & Nível 1 DUA:** `#15803D` (*Verde Esmeralda* — Conquista e Reforço Positivo).
* **Alerta & Dicas IAVE:** `#B45309` (*Âmbar Dourado* — Sol do Algarve / Foco de Atenção sem Ansiedade).
* **Desafio & Nível 3:** `#6D28D9` (*Púrpura Criativo* — Raciocínio Algébrico / Superação).

### B. A "Regra de Ouro" da Fotocopiadora P&B
> [!WARNING] **O Perigo dos Cinzentos Claros:**  
> Tons de cinzento como `#E2E8F0` ou `#CBD5E1` (20% a 30% de tinta) saem **completamente invisíveis ou manchados** nas fotocopiadoras das escolas.

1. **Linhas de Escrita e Pautas:** Devem ser em `#475569` (cinzento escuro) ou `#000000` puro, com espessura de fio mínima de **$1.2\text{ pt}$**.
2. **Contornos de Caixas de Resposta:** Linha sólida preta de **$1.5\text{ pt}$** sobre fundo branco `#FFFFFF` puro (nunca cinzento a cobrir o interior, pois impede o aluno de ver o que escreve a lápis).
3. **Imagens e Ilustrações:** Ilustrações com **contornos a tinta grossos (*bold ink*)** no estilo *Gravity Falls* ou desenho técnico vetorial, com fundo transparente ou branco puro sem degradés escuros.

---

## 4. O Cabeçalho Oficial Standard (DGE / IAVE / EB da Lejana)

O cabeçalho deve ser compacto (altura máxima de **$32\text{ mm}$ a $35\text{ mm}$**), funcional e preencher toda a largura da folha A4.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ESCOLA BÁSICA DA LEJANA — FARO                     [ ESTUDO DO MEIO ]  [ 4.º ANO ]     │
│ 1.º Ciclo do Ensino Básico • Ano Letivo 2025/2026                                      │
├────────────────────────────────────────────────────────────┬───────────────────────────┤
│ Nome: ____________________________________________________ │ MENÇÃO QUALITATIVA        │
│ N.º: [ ___ ]   Turma: 4.º [ ___ ]   Data: ____ / ____ / 2026│ [ ] Insuf.   [ ] Suf.     │
│                                                            │ [ ] Bom      [ ] Muito Bom│
│ Prof.: _____________________  E.E.: ______________________ │ Rúbrica DUA: N1 [ ] N2 [ ]│
└────────────────────────────────────────────────────────────┴───────────────────────────┘
```

* **Na Impressão:** Logótipos gráficos não essenciais (como caixas com letras soltas) devem ser ocultados (`print:hidden`).
* **Linhas de escrita para o aluno:** Linhas tracejadas ou sólidas com altura mínima de **$5\text{ mm}$** entre a etiqueta e a linha para o lápis de grafite.

---

## 5. Anatomia e Espaçamento dos Componentes Pedagógicos

### A. Perguntas de Escolha Múltipla (Grelha de 2 Colunas)
As opções **nunca devem ficar amontoadas na mesma linha**. Devem seguir uma grelha de 2 colunas simétricas:
* **Coluna da Esquerda:** Opção **A** e Opção **B**.
* **Coluna da Direita:** Opção **C** e Opção **D**.
* **Caixa da Letra:** Quadrado de **$7 \times 7\text{ mm}$** com a letra centrada a negrito e linha para assinalar com cruz ($\times$).
* **Espaço entre opções:** Mínimo de **$8\text{ mm}$** de respiro vertical para não baralhar a leitura.

### B. Exercícios de Correspondência ("Ligar com Setas")
Para que os alunos de 9 anos consigam desenhar setas com a régua:
1. **Pontos de Ancoragem:** As duas colunas devem conter círculos pretos bem visíveis (`●`).
2. **Distância Central Livre:** Pelo menos **$45\text{ mm}$ a $55\text{ mm}$ de espaço vazio horizontal** entre a Coluna A e a Coluna B, permitindo traçar linhas retas sem riscar por cima do texto.
3. **Se for por Preenchimento de Tabela:** Cada função deve ter um número obrigatório (`[ 1 ]`, `[ 2 ]`) e a tabela deve incluir uma linha modelo preenchida (`*(Exemplo)*`).

### C. Espaço Muscular para Resposta e Cálculos
As crianças do 1.º Ciclo ainda estão a consolidar a motricidade fina (pega "Bico do Pato"):
* **Linhas de Resposta Escrita (Frases):** Altura entre linhas de **$10\text{ mm}$ a $12\text{ mm}$** (nunca linhas apertadas de cadernos de adultos de 6 mm).
* **Pauta Caligráfica Tripla (Céu · Relva · Terra):**
  * Céu superior: **$28\%$** da altura total ($2.5\text{ mm}$).
  * Relva central sombreada: **$44\%$** da altura total ($4\text{ mm}$ com linha de base a preto retinto).
  * Terra inferior: **$28\%$** da altura total ($2.5\text{ mm}$).
* **Grelha Quadriculada de Cálculo (Matemática):** Quadrícula exata de **$5 \times 5\text{ mm}$** (ou $7 \times 7\text{ mm}$ no 1.º e 2.º anos) com contorno a cinzento escuro de $0.8\text{ pt}$.

---

## 6. Diagramas, Imagens e Recursos Visuais C.R.A.

* **Diagramas Matemáticos (Frações, Relógios, Balanças):**
  * Desenhados em vetor SVG nativo.
  * Espessura de traço consistente: **$2\text{ pt}$ a $2.5\text{ pt}$**.
  * Cores de preenchimento contrastadas com linhas de contorno pretas (nunca formas sem contorno que desapareçam ao fotocopiar).
* **Thinking Maps (Mapas Cognitivos de David Hyerle):**
  * Caixas com cantos arredondados (`rx="8"`), setas com pontas fechadas nítidas e texto em português correto.
* **Ilustrações de Histórias:**
  * Estilo *Gravity Falls* ou ilustração de livro infantil.
  * Personagens expressivas (olhos redondos, poses dinâmicas) e contornos a tinta nítidos.

---

## 7. Regras de Paginação Física e Continuação (Fichas de 2 Páginas)

1. **Regra de Ouro Anti-Orfandade:**
   * Um enunciado nunca pode ficar no fundo da Página 1 e a respetiva pergunta ou opções na Página 2 (`break-inside: avoid`).
   * Um exercício de cálculo ou tabela nunca pode ser partido a meio por uma quebra de página.
2. **Cabeçalho de Continuação na Página 2:**
   * Na página 2, o cabeçalho completo não se repete. Substitui-se por uma **Barra de Continuação de $10\text{ mm}$**:
   ```
   Escola Básica da Lejana • Nome: ___________________________________ • 4.º Ano • Pág. 2
   ──────────────────────────────────────────────────────────────────────────────────────
   ```
3. **Divisão de Páginas por Tipologia de Tarefa:**
   * **Frente da Folha (Página 1):** Ativação, texto de leitura ou situação-problema com perguntas diretas.
   * **Verso da Folha (Página 2):** Resolução de problemas multi-etapas, produção escrita guiada ou desafio DUA Nível 3.
