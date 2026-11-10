import React from 'react';
import { NeuroPaletteId, WorksheetConfig } from '../types/worksheet';
import { NEURO_PALETTE_LIST, getNeuroPalette } from '../utils/neuro-palettes';
import { Palette, Check, Sparkles } from 'lucide-react';

interface Props {
  config: WorksheetConfig;
  onUpdateConfig: (updates: Partial<WorksheetConfig>) => void;
  compact?: boolean;
}

export const NeuroPalettePanel: React.FC<Props> = ({
  config,
  onUpdateConfig,
  compact = false
}) => {
  const activePaletteId: NeuroPaletteId = config.neuroPalette || 'creme_aveia';
  const activeSpec = getNeuroPalette(activePaletteId);

  const handleSelectPalette = (id: NeuroPaletteId) => {
    const spec = getNeuroPalette(id);
    onUpdateConfig({
      neuroPalette: id,
      themeColor: spec.themeColor,
      monochromePrintMode: false
    });
  };

  const handleSuggestBySubject = () => {
    const subj = config.subject;
    if (subj === 'Matemática') {
      handleSelectPalette('nevoeiro_nordico');
    } else if (subj === 'Estudo do Meio' || subj === 'Cidadania e Desenvolvimento') {
      handleSelectPalette('salvia_zen');
    } else if (subj === 'Expressões Artísticas') {
      handleSelectPalette('lavanda_serena');
    } else if (config.grade === '1º Ano') {
      handleSelectPalette('areia_duna');
    } else {
      handleSelectPalette('creme_aveia');
    }
  };

  if (compact) {
    return (
      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Palette className="w-3.5 h-3.5 text-[#2B4C7E]" />
            <span>Paleta Neuro-Acolhedora:</span>
          </div>
          <button
            type="button"
            onClick={handleSuggestBySubject}
            className="text-[11px] font-semibold text-[#2B4C7E] hover:underline flex items-center gap-1 cursor-pointer"
            title="Sugerir paleta suave ideal para a disciplina e ano"
          >
            <Sparkles className="w-3 h-3" />
            <span>Sugerir p/ {config.subject}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {NEURO_PALETTE_LIST.map((pal) => {
            const isSelected = pal.id === activePaletteId;
            return (
              <button
                key={pal.id}
                type="button"
                onClick={() => handleSelectPalette(pal.id)}
                className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-800 bg-white shadow-2xs ring-1 ring-slate-800'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
                title={`${pal.name} — ${pal.benefit}`}
              >
                {/* Swatch duplo: Papel + Acento */}
                <span
                  className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: pal.paperBg }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pal.accentCalm }}
                  />
                </span>
                <span className="text-[11px] font-semibold text-slate-800 truncate">
                  {pal.shortName}
                </span>
              </button>
            );
          })}
        </div>
        <div className="text-[10px] text-slate-500 leading-tight">
          Ativa: <strong className="text-slate-700">{activeSpec.name}</strong> — {activeSpec.benefit}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#2B4C7E]" />
          <span>Paletas Neuro-Acolhedoras (Baixo Estímulo)</span>
        </label>
        <button
          type="button"
          onClick={handleSuggestBySubject}
          className="text-[11px] font-bold text-[#2B4C7E] bg-white hover:bg-blue-50 px-2 py-1 rounded-md border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Auto-Sugerir</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-600 leading-snug">
        Tons neutros, pastel-seco e dessaturados aplicados a todo o documento para evitar sobrecarga visual, encandeamento (Síndrome de Irlen) e fadiga atencional.
      </p>

      <div className="grid grid-cols-1 gap-2 pt-1">
        {NEURO_PALETTE_LIST.map((pal) => {
          const isSelected = pal.id === activePaletteId;
          return (
            <button
              key={pal.id}
              type="button"
              onClick={() => handleSelectPalette(pal.id)}
              className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                isSelected
                  ? 'border-slate-800 bg-white shadow-xs ring-1 ring-slate-800'
                  : 'border-slate-200/90 bg-white/75 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{pal.name}</span>
                  {isSelected && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 leading-snug">{pal.benefit}</div>
                <div className="text-[10px] font-medium text-slate-500">
                  Ideal para: {pal.recommendedFor}
                </div>
              </div>

              {/* Mostra das 4 camadas cromáticas da paleta: Papel, Superfície, Contorno e Acento */}
              <div
                className="flex items-center -space-x-1.5 pt-0.5 flex-shrink-0"
                title="Camadas: Papel A4 • Caixa Suave • Contorno • Acento Calmo"
              >
                <span
                  className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: pal.paperBg }}
                />
                <span
                  className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: pal.surfaceTint }}
                />
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-2xs"
                  style={{ backgroundColor: pal.borderCalm }}
                />
                <span
                  className="w-5 h-5 rounded-full border border-white shadow-2xs"
                  style={{ backgroundColor: pal.accentCalm }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Opção para manter o fundo suave na exportação PDF a cores */}
      <label className="flex items-center gap-2 pt-1.5 text-xs text-slate-700 cursor-pointer border-t border-slate-200/80">
        <input
          type="checkbox"
          checked={Boolean(config.keepSoftTintOnPrint)}
          onChange={(e) => onUpdateConfig({ keepSoftTintOnPrint: e.target.checked })}
          className="rounded text-[#1E3A8A]"
        />
        <span>Manter tom de papel neuro-acolhedor ao exportar PDF / Imprimir a cores</span>
      </label>
    </div>
  );
};
