import React from 'react';
import { WorksheetConfig } from '../types/worksheet';
import { calculatePageBudget, getFitToTargetRecommendation } from '../utils/print-helpers';
import {
  Printer,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Copy,
  PanelLeftClose,
  PanelLeftOpen,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  config: WorksheetConfig;
  onUpdateConfig: (updates: Partial<WorksheetConfig>) => void;
  onPrint: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const PrintBudgetBar: React.FC<Props> = ({
  config,
  onUpdateConfig,
  onPrint,
  sidebarOpen,
  onToggleSidebar
}) => {
  const budget = calculatePageBudget(config);

  const handleFitTo = (pages: 1 | 2) => {
    const rec = getFitToTargetRecommendation(config.exercises, pages);
    onUpdateConfig({
      spacingDensity: rec.spacing,
      fontSizeScale: rec.fontSize
    });
  };

  return (
    <div className="no-print bg-white border-b border-slate-200 px-3 sm:px-4 py-2 shadow-2xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Marca da Aplicação & Status de Paginação */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
              aria-label={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer flex items-center justify-center"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          )}

          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <span className="p-1.5 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <div className="hidden sm:block leading-none">
              <span className="font-bold text-slate-900 text-sm tracking-tight block">
                FichaCriativa
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Norma DUA • 1º Ciclo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {budget.estimatedPageCount === 1 ? '1 Página A4 Prevista' : `${budget.estimatedPageCount} Páginas A4`}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 border-l border-slate-200 pl-3">
            <ShieldCheck className="w-4 h-4 text-[#15803D] flex-shrink-0" />
            <span className="font-semibold text-slate-700">Norma Anti-Orfandade Ativa</span>
          </div>
        </div>

        {/* Ferramentas de Ajuste Inteligente & Impressão */}
        <div className="flex items-center gap-2">

          {/* Botão Otimizar para 1 Página */}
          <button
            onClick={() => handleFitTo(1)}
            title="Compacta automaticamente fonte e espaçamento para caber em 1 folha A4"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 text-xs font-medium text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Caber em 1 Folha</span>
          </button>

          {/* Botão Expandir para 2 Páginas */}
          <button
            onClick={() => handleFitTo(2)}
            title="Espaça generosamente com letras maiores para 2 folhas A4"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 text-xs font-medium text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Espaçar em 2 Folhas</span>
          </button>

          {/* Modo Fotocopiadora P&B */}
          <button
            onClick={() => onUpdateConfig({ monochromePrintMode: !config.monochromePrintMode })}
            title="Ativa o modo preto e branco de alto contraste (#475569 / #000) para fotocopiadoras escolares"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              config.monochromePrintMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{config.monochromePrintMode ? 'P&B Fotocópia (Ativo)' : 'P&B Fotocópia'}</span>
          </button>

          {/* Botão Principal: Imprimir / Exportar PDF */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
