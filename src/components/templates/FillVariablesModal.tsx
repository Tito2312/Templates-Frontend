import React, { useState } from 'react';
import { X, Copy, Sparkles } from 'lucide-react';
import type { TemplateResponse } from '../../types';

interface FillVariablesModalProps {
  isOpen: boolean;
  template: TemplateResponse | null;
  variables: string[];
  onClose: () => void;
  onCopyFormatted: (formattedContent: string) => void;
}

export const FillVariablesModal: React.FC<FillVariablesModalProps> = ({
  isOpen,
  template,
  variables,
  onClose,
  onCopyFormatted,
}) => {
  // Guardar los valores tipeados por el agente para cada variable
  const [values, setValues] = useState<Record<string, string>>({});

  if (!isOpen || !template) return null;

  const handleChange = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  // Previsualización del mensaje en tiempo real
  const getFormattedContent = () => {
    let result = template.content;
    variables.forEach((v) => {
      const replacement = values[v] !== undefined && values[v] !== '' ? values[v] : `{${v}}`;
      // Reemplaza todas las ocurrencias de {variable}
      result = result.replaceAll(`{${v}}`, replacement);
    });
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = getFormattedContent();
    onCopyFormatted(finalContent);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 cursor-default relative"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Completar Variables</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Ingresa los valores para personalizar el mensaje de <strong className="text-slate-200">{template.title}</strong>:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {variables.map((variable) => (
              <div key={variable}>
                <label className="block text-xs font-semibold text-indigo-300 capitalize mb-1">
                  {variable}
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Ej. ingresar ${variable}...`}
                  value={values[variable] || ''}
                  onChange={(e) => handleChange(variable, e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          {/* Previsualización del texto resultante */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Vista previa del mensaje:
            </label>
            <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
              {getFormattedContent()}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Mensaje</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};