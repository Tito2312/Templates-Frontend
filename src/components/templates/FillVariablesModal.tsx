import React, { useState, useMemo } from 'react';
import { X, Check, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';
import type { TemplateResponse } from '../../types';
import { copyImageToClipboard } from '../../utils/clipboardUtils';
import { extractVariables } from '../../utils/templateUtils';

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
}) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Extraemos las variables usando extractVariables (soporta {}, [] y ())
  const variablesList = useMemo(() => {
    if (!template) return [];
    return extractVariables(template.content);
  }, [template?.content]);

  if (!isOpen || !template) return null;

  const handleCloseModal = () => {
    setVariableValues({});
    onClose();
  };

  // Reemplaza de forma segura cualquier formato de variable: {var}, [var], (var)
  const getFilledContent = () => {
    if (!template) return '';
    let result = template.content;

    variablesList.forEach((varName) => {
      const value = variableValues[varName];
      if (value !== undefined && value.trim() !== '') {
        const regex = new RegExp(`(\\{${varName}\\}|\\[${varName}\\]|\\(${varName}\\))`, 'g');
        result = result.replace(regex, value);
      }
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
    <div 
      onClick={handleCloseModal}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-theme-surface border border-theme rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 cursor-default"
      >
        
        {/* Encabezado */}
        <div className="flex justify-between items-center p-5 border-b border-theme/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-theme-elevated border border-theme rounded-xl text-theme-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-primary">Completar Variables</h2>
              <p className="text-[11px] text-theme-muted">{template.title}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleCloseModal} 
            className="text-theme-muted hover:text-theme-primary transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Campos dinámicos */}
          {variablesList.length > 0 && (
            <div className="space-y-3 bg-theme-elevated/50 p-4 rounded-xl border border-theme/60">
              <h3 className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
                Campos Dinámicos
              </h3>
              {variablesList.map((varName) => (
                <div key={varName} className="space-y-1">
                  <label className="text-xs font-medium text-theme-primary capitalize">
                    {varName}
                  </label>
                  <input
                    type="text"
                    value={variableValues[varName] || ''}
                    onChange={(e) =>
                      setVariableValues({ ...variableValues, [varName]: e.target.value })
                    }
                    placeholder={`Ingresa ${varName}...`}
                    className="w-full bg-theme-elevated border border-theme rounded-xl px-3.5 py-2 text-xs text-theme-primary placeholder:text-theme-muted/60 focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Previsualización de Imagen opcional */}
          {template.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-theme bg-theme-elevated/40 p-3 space-y-2">
              <span className="text-[11px] font-medium text-theme-muted flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-theme-accent" /> Imagen adjunta
              </span>
              <img src={template.imageUrl} alt="Preview" className="max-h-36 w-full object-contain rounded-lg" />
            </div>
          )}

          {/* Vista previa del resultado */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-muted flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-theme-accent" /> Vista previa del resultado
            </label>
            <div className="bg-theme-elevated/80 border border-theme/60 rounded-xl p-3.5 text-xs font-mono text-theme-primary/90 whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar leading-relaxed">
              {getFilledContent()}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between p-4 border-t border-theme bg-theme-surface/80">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 text-xs font-semibold text-theme-muted hover:text-theme-primary transition cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2">
            {template.imageUrl && (
              <button
                type="button"
                onClick={handleCopyImage}
                className="px-3.5 py-2 text-theme-primary bg-theme-elevated hover:bg-theme-elevated/80 border border-theme rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {copyStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
                {copyStatus || 'Copiar Imagen'}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyText}
              className="btn-theme-primary px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
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