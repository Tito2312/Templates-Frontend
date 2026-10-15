import React, { useState, useMemo } from 'react';
import { X, Check, Image as ImageIcon, FileText } from 'lucide-react';
import type { TemplateResponse } from '../../types';
import { copyImageToClipboard } from '../../utils/clipboardUtils';

interface FillVariablesModalProps {
  isOpen: boolean;
  template: TemplateResponse | null;
  onClose: () => void;
  onCopyFilledText: (filledText: string) => void;
  themeColor?: string;
}

export const FillVariablesModal: React.FC<FillVariablesModalProps> = ({
  isOpen,
  template,
  onClose,
  onCopyFilledText,
  themeColor,
}) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const activeColor = themeColor || '#6366f1';

  // Extraemos las variables dinámicamente durante el render sin necesidad de useEffect/setState
  const variablesList = useMemo(() => {
    if (!template) return [];
    const matches = template.content.match(/\[(.*?)\]/g) || [];
    return Array.from(new Set(matches.map((v) => v.replace('[', '').replace(']', ''))));
  }, [template?.content]);

  if (!isOpen || !template) return null;

  const handleCloseModal = () => {
    setVariableValues({});
    onClose();
  };

  // Generar el texto resultante reemplazando las variables
  const getFilledContent = () => {
    let result = template.content;
    variablesList.forEach((varName) => {
      const val = variableValues[varName] || `[${varName}]`;
      result = result.replaceAll(`[${varName}]`, val);
    });
    return result;
  };

  const handleCopyText = () => {
    const textToCopy = getFilledContent();
    onCopyFilledText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!template.imageUrl) return;
    const success = await copyImageToClipboard(template.imageUrl);
    if (success) {
      setCopyStatus('¡Imagen copiada!');
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center p-5 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Completar Variables</h2>
            <p className="text-xs text-slate-400">{template.title}</p>
          </div>
          <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-200 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Campos dinámicos */}
          {variablesList.length > 0 && (
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/60">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Campos Dinámicos
              </h3>
              {variablesList.map((varName) => (
                <div key={varName} className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 capitalize">
                    {varName}
                  </label>
                  <input
                    type="text"
                    value={variableValues[varName] || ''}
                    onChange={(e) =>
                      setVariableValues({ ...variableValues, [varName]: e.target.value })
                    }
                    placeholder={`Ingresa ${varName}...`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Previsualización de Imagen opcional */}
          {template.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50 p-2">
              <span className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Imagen adjunta
              </span>
              <img src={template.imageUrl} alt="Preview" className="max-h-36 w-full object-contain rounded-lg" />
            </div>
          )}

          {/* Vista previa del resultado */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Vista previa del resultado</label>
            <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
              {getFilledContent()}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/80">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2">
            {template.imageUrl && (
              <button
                type="button"
                onClick={handleCopyImage}
                className="px-3.5 py-2 text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {copyStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
                {copyStatus || 'Copiar Imagen'}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyText}
              style={{ backgroundColor: activeColor }}
              className="px-4 py-2 text-white rounded-xl text-xs font-medium hover:brightness-110 transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              {isCopied ? '¡Texto Copiado!' : 'Copiar Texto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};