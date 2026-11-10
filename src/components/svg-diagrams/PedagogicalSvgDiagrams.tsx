import React from 'react';
import { VisualDiagramType } from '../../types/worksheet';

interface Props {
  type?: VisualDiagramType;
}

export const DIAGRAM_OPTIONS: { value: VisualDiagramType; label: string }[] = [
  { value: 'none', label: 'Sem Esquema SVG' },
  { value: 'bar_model', label: '📊 Modelo de Barras C.R.A. (Singapura)' },
  { value: 'mab_blocks', label: '🧱 Material Multibásico (MAB / C-D-U)' },
  { value: 'number_line', label: '📏 Reta Numérica Vetorial' },
  { value: 'fraction_bars', label: '🍰 Tiras de Frações Equivalentes' },
  { value: 'analog_clock', label: '🕒 Relógio Analógico 12h' },
  { value: 'thinking_map_bubble', label: '💭 Thinking Map: Mapa de Bolhas' },
  { value: 'thinking_map_flow', label: '➡️ Thinking Map: Mapa de Fluxo' },
  { value: 'thinking_map_tree', label: '🌳 Thinking Map: Mapa em Árvore' }
];

/**
 * Implementação direta das Skills:
 * - svg-vector-baoyu-diagram (Manipulativos Matemáticos em SVG Puro 2pt)
 * - math-cra-diagnostics (Método Singapura Concreto-Pictórico-Abstrato / Bar Model)
 * - thinking-maps-hand-drawn (Thinking Maps de Dr. David Hyerle com rx="8")
 * - dual-coding-multimodal (Codificação Dupla Paivio & Mayer sem Split-Attention)
 */
export const PedagogicalSvgDiagrams: React.FC<Props> = ({ type }) => {
  if (!type || type === 'none') return null;

  return (
    <div className="my-2.5 p-3 bg-white border-[1.5px] border-slate-700 rounded-lg flex flex-col items-center justify-center">
      {/* 1. MODELO DE BARRAS SINGAPURA (C.R.A. - Bar Model) */}
      {type === 'bar_model' && (
        <div className="w-full max-w-md">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Esquema Pictórico C.R.A. (Modelo de Barras — Parte / Todo)
          </div>
          <svg viewBox="0 0 420 95" className="w-full h-auto" aria-label="Modelo de Barras C.R.A.">
            {/* Chaveta Superior do Todo */}
            <path
              d="M 20 28 Q 20 14 35 14 L 195 14 Q 210 14 210 4 Q 210 14 225 14 L 385 14 Q 400 14 400 28"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <text x="210" y="11" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">
              Todo: _______
            </text>

            {/* Barra Parte 1 */}
            <rect
              x="20"
              y="34"
              width="220"
              height="36"
              rx="4"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <text x="130" y="56" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#334155">
              Parte 1: _______
            </text>

            {/* Barra Parte 2 */}
            <rect
              x="240"
              y="34"
              width="160"
              height="36"
              rx="4"
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
            <text x="320" y="56" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#334155">
              Parte 2: ?
            </text>
          </svg>
        </div>
      )}

      {/* 2. MATERIAL MULTIBÁSICO (MAB: Centenas, Dezenas, Unidades) */}
      {type === 'mab_blocks' && (
        <div className="w-full max-w-md">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Representação Concreta C.R.A. — Material Multibásico (MAB)
          </div>
          <svg viewBox="0 0 420 90" className="w-full h-auto" aria-label="Material Multibásico MAB">
            {/* Placa da Centena (100) */}
            <g transform="translate(25, 10)">
              <rect x="0" y="0" width="60" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              {[12, 24, 36, 48].map((pos) => (
                <React.Fragment key={pos}>
                  <line x1={pos} y1="0" x2={pos} y2="60" stroke="#475569" strokeWidth="1" />
                  <line x1="0" y1={pos} x2="60" y2={pos} stroke="#475569" strokeWidth="1" />
                </React.Fragment>
              ))}
              <text x="30" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
                1 Centena (100)
              </text>
            </g>

            {/* Barras de Dezena (10) */}
            <g transform="translate(155, 10)">
              {[0, 22, 44].map((xOff, i) => (
                <g key={i} transform={`translate(${xOff}, 0)`}>
                  <rect x="0" y="0" width="12" height="60" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  {[12, 24, 36, 48].map((yPos) => (
                    <line key={yPos} x1="0" y1={yPos} x2="12" y2={yPos} stroke="#475569" strokeWidth="1" />
                  ))}
                </g>
              ))}
              <text x="28" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
                Dezenas (10)
              </text>
            </g>

            {/* Cubos de Unidade (1) */}
            <g transform="translate(285, 25)">
              {[0, 20, 40, 60].map((xOff, i) => (
                <rect
                  key={i}
                  x={xOff}
                  y="10"
                  width="12"
                  height="12"
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              ))}
              <text x="36" y="61" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
                Unidades (1)
              </text>
            </g>
          </svg>
        </div>
      )}

      {/* 3. RETA NUMÉRICA VETORIAL */}
      {type === 'number_line' && (
        <div className="w-full max-w-lg">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Reta Numérica de Apoio ao Cálculo (Desenha os saltos)
          </div>
          <svg viewBox="0 0 460 65" className="w-full h-auto" aria-label="Reta Numérica">
            {/* Linha Principal com Setas */}
            <line x1="20" y1="40" x2="440" y2="40" stroke="#0f172a" strokeWidth="2.2" />
            <polygon points="15,40 24,35 24,45" fill="#0f172a" />
            <polygon points="445,40 436,35 436,45" fill="#0f172a" />

            {/* Marcações (11 marcas de 0 a 10) */}
            {Array.from({ length: 11 }).map((_, idx) => {
              const x = 35 + idx * 39;
              return (
                <g key={idx}>
                  <line x1={x} y1="32" x2={x} y2="48" stroke="#0f172a" strokeWidth="2" />
                  <rect
                    x={x - 14}
                    y="50"
                    width="28"
                    height="13"
                    rx="2"
                    fill="#ffffff"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* 4. BARRAS E CÍRCULOS DE FRAÇÕES */}
      {type === 'fraction_bars' && (
        <div className="w-full max-w-md">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Diagrama Vetorial de Frações (Pinta as partes pedidas)
          </div>
          <svg viewBox="0 0 420 75" className="w-full h-auto" aria-label="Diagrama de Frações">
            {/* Barra dividida em 4 quartos */}
            <g transform="translate(20, 18)">
              <rect x="0" y="0" width="200" height="36" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <line x1="50" y1="0" x2="50" y2="36" stroke="#0f172a" strokeWidth="2" />
              <line x1="100" y1="0" x2="100" y2="36" stroke="#0f172a" strokeWidth="2" />
              <line x1="150" y1="0" x2="150" y2="36" stroke="#0f172a" strokeWidth="2" />
            </g>

            {/* Dois círculos divididos em 4 */}
            {[280, 355].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy="36" r="24" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <line x1={cx - 24} y1="36" x2={cx + 24} y2="36" stroke="#0f172a" strokeWidth="1.8" />
                <line x1={cx} y1="12" x2={cx} y2="60" stroke="#0f172a" strokeWidth="1.8" />
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* 5. RELÓGIO ANALÓGICO VETORIAL */}
      {type === 'analog_clock' && (
        <div className="w-full flex flex-col items-center">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Relógio Analógico e Digital
          </div>
          <svg viewBox="0 0 260 95" className="w-64 h-auto" aria-label="Relógio Analógico">
            <circle cx="65" cy="48" r="40" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <circle cx="65" cy="48" r="3" fill="#0f172a" />
            <text x="65" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">12</text>
            <text x="97" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">3</text>
            <text x="65" y="82" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">6</text>
            <text x="33" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">9</text>

            {/* Visor Digital ao lado */}
            <rect x="135" y="28" width="100" height="40" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <text x="185" y="54" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0f172a">
              __ : __
            </text>
          </svg>
        </div>
      )}

      {/* 6. THINKING MAP: MAPA DE BOLHAS (Dr. David Hyerle) */}
      {type === 'thinking_map_bubble' && (
        <div className="w-full max-w-md">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Thinking Map (Dr. David Hyerle) — Mapa de Bolhas / Caraterização
          </div>
          <svg viewBox="0 0 420 120" className="w-full h-auto" aria-label="Thinking Map Mapa de Bolhas">
            {/* Linhas de ligação */}
            <line x1="210" y1="60" x2="75" y2="28" stroke="#0f172a" strokeWidth="2" />
            <line x1="210" y1="60" x2="345" y2="28" stroke="#0f172a" strokeWidth="2" />
            <line x1="210" y1="60" x2="75" y2="92" stroke="#0f172a" strokeWidth="2" />
            <line x1="210" y1="60" x2="345" y2="92" stroke="#0f172a" strokeWidth="2" />

            {/* Nó Central */}
            <rect x="145" y="38" width="130" height="44" rx="22" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            <text x="210" y="64" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">
              Tema Central
            </text>

            {/* 4 Bolhas Satélite */}
            {[
              { x: 15, y: 8 },
              { x: 285, y: 8 },
              { x: 15, y: 72 },
              { x: 285, y: 72 }
            ].map((b, i) => (
              <rect
                key={i}
                x={b.x}
                y={b.y}
                width="120"
                height="38"
                rx="19"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      )}

      {/* 7. THINKING MAP: MAPA DE FLUXO / SEQUÊNCIA (Flow Map) */}
      {type === 'thinking_map_flow' && (
        <div className="w-full max-w-lg">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Thinking Map (Dr. David Hyerle) — Mapa de Fluxo / Sequência
          </div>
          <svg viewBox="0 0 450 75" className="w-full h-auto" aria-label="Thinking Map Mapa de Fluxo">
            {[0, 1, 2].map((step) => {
              const x = 15 + step * 150;
              return (
                <React.Fragment key={step}>
                  <rect
                    x={x}
                    y="12"
                    width="120"
                    height="50"
                    rx="8"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <text x={x + 12} y="28" fontSize="10" fontWeight="bold" fill="#475569">
                    {step + 1}.º Passo
                  </text>
                  {step < 2 && (
                    <g>
                      <line x1={x + 123} y1="37" x2={x + 144} y2="37" stroke="#0f172a" strokeWidth="2.2" />
                      <polygon points={`${x + 147},37 ${x + 140},32 ${x + 140},42`} fill="#0f172a" />
                    </g>
                  )}
                </React.Fragment>
              );
            })}
          </svg>
        </div>
      )}

      {/* 8. THINKING MAP: MAPA DE ÁRVORE / CLASSIFICAÇÃO (Tree Map) */}
      {type === 'thinking_map_tree' && (
        <div className="w-full max-w-lg">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
            Thinking Map (Dr. David Hyerle) — Mapa de Árvore / Classificação
          </div>
          <svg viewBox="0 0 450 95" className="w-full h-auto" aria-label="Thinking Map Mapa de Árvore">
            {/* Topo */}
            <rect x="155" y="6" width="140" height="26" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <line x1="225" y1="32" x2="225" y2="46" stroke="#0f172a" strokeWidth="2" />
            <line x1="75" y1="46" x2="375" y2="46" stroke="#0f172a" strokeWidth="2" />

            {/* 3 Ramos */}
            {[75, 225, 375].map((cx, i) => (
              <g key={i}>
                <line x1={cx} y1="46" x2={cx} y2="56" stroke="#0f172a" strokeWidth="2" />
                <rect x={cx - 60} y="56" width="120" height="32" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};
