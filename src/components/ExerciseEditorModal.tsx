import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseType, VisualDiagramType } from '../types/worksheet';
import { DIAGRAM_OPTIONS } from './svg-diagrams/PedagogicalSvgDiagrams';
import { X, Check } from 'lucide-react';

interface Props {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Exercise) => void;
}

export const ExerciseEditorModal: React.FC<Props> = ({
  exercise,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Exercise | null>(null);

  useEffect(() => {
    if (exercise) {
      setFormData({
        ...exercise,
        content: { ...(exercise.content || {}) }
      });
    }
  }, [exercise]);

  if (!isOpen || !exercise || !formData) return null;

  const exerciseTypes: { id: ExerciseType; label: string }[] = [
    { id: 'table_activity', label: '📊 Tabela Estruturada + Legenda / Caixa de Respostas' },
    { id: 'visual_observation', label: '🖼️ Ilustração Recortada do PDF + Causa-Efeito' },
    { id: 'word_discrimination', label: '✏️ Discriminação de Conceitos [opção1 / opção2]' },
    { id: 'code_matching', label: '🗂️ Associação de Códigos com Quadrícula [ ]' },
    { id: 'multiple_choice', label: '🔠 Escolha Múltipla [A/B/C/D]' },
    { id: 'fill_blank', label: '✏️ Preencher Espaços + Caixa de Palavras' },
    { id: 'text_comprehension', label: '📖 Leitura & Interpretação (Caixa Zorzi)' },
    { id: 'math_problem', label: '🧮 Problema Matemático (Esquema C.R.A. / Grelha)' },
    { id: 'math_calculation', label: '➕ Operações / Contas Armadas Tabulares' },
    { id: 'matching', label: '🔗 Ligar Colunas (Correspondência 50mm)' },
    { id: 'true_false', label: '✅ Verdadeiro ou Falso [V/F]' },
    { id: 'calligraphy', label: '✍️ Caligrafia na Pauta Tripla (Céu · Relva · Terra)' },
    { id: 'drawing_creative', label: '🎨 Moldura de Desenho & Esquema' },
    { id: 'free_response', label: '📝 Resposta Livre com Linhas Guiadas' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Ajustar Layout do Bloco {formData.groupLabel || formData.number}
            </h2>
            <p className="text-xs text-slate-500">
              Configura o componente visual, tabela, recorte de imagem, esquema SVG e quebra de página
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar editor de exercício"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {/* Tipo de Componente Visual e Esquema SVG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Componente de Layout Visual:
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExerciseType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs font-semibold"
              >
                {exerciseTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Esquema Vetorial SVG (Dual-Coding):
              </label>
              <select
                value={formData.visualDiagram || 'none'}
                onChange={(e) => setFormData({ ...formData, visualDiagram: e.target.value as VisualDiagramType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs font-semibold"
              >
                {DIAGRAM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Número, Etiqueta de Grupo e Domínio */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número:
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Ex: 1."
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Grupo (opcional):
              </label>
              <input
                type="text"
                value={formData.groupLabel || ''}
                onChange={(e) => setFormData({ ...formData, groupLabel: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Ex: GRUPO I"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Domínio / Etiqueta:
              </label>
              <input
                type="text"
                value={formData.domainTag || ''}
                onChange={(e) => setFormData({ ...formData, domainTag: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Ex: Organização de Dados"
              />
            </div>
          </div>

          {/* Enunciado */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título / Enunciado Principal:
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Narrativa / Contexto Opcional */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Texto de Contexto / Instrução da Questão (opcional):
            </label>
            <textarea
              rows={2}
              value={formData.content.contextText || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, contextText: e.target.value }
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Quebra de página controlada */}
          <div className="flex items-center gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg">
            <input
              type="checkbox"
              id="forceBreakCheck"
              checked={!!formData.forcePageBreakBefore}
              onChange={(e) => setFormData({ ...formData, forcePageBreakBefore: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="forceBreakCheck" className="text-xs font-semibold text-indigo-900 cursor-pointer">
              Forçar quebra de página antes deste exercício (começar no topo de uma nova folha A4)
            </label>
          </div>
        </form>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            Guardar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
