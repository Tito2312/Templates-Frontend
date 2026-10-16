export interface ThemePalette {
  primary: string;        // Color exacto de la marca (#00f6fa)
  primaryHover: string;   // Versión ligeramente más clara/brillante
  bgBase: string;         // Fondo profundo de la app (#081326 aprox en azul)
  bgSurface: string;      // Fondo de contenedores y tarjetas (#0d2448 aprox)
  bgElevated: string;     // Fondo de campos e inputs (#143466 aprox)
  border: string;         // Bordes limpios y visibles (#1e4785 aprox)
  textPrimary: string;    // Texto principal de alta legibilidad
  textMuted: string;      // Texto secundario azulado/suave
}

/**
 * Convierte un código HEX a valores HSL (Hue, Saturation, Lightness).
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }

  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { h: 215, s: 60, l: 20 }; // Default azul profundo
  }

  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Genera una paleta en modo oscuro armónico y vibrante basada en el tono de la marca.
 */
export function generateThemeFromHex(colorHex?: string): ThemePalette {
  const baseColor = colorHex && /^#[0-9A-F]{3,6}$/i.test(colorHex) ? colorHex : '#6366f1';
  const { h, s } = hexToHsl(baseColor);

  // Mantenemos una saturación rica (entre 45% y 65%) para teñir verdaderamente los fondos
  const bgSat = Math.max(45, Math.min(s, 65));

  return {
    primary: baseColor,
    primaryHover: `hsl(${h}, ${Math.max(s, 70)}%, 65%)`,
    bgBase: `hsl(${h}, ${bgSat}%, 9%)`,           // Azul/Tono Noche Profundo (#081222)
    bgSurface: `hsl(${h}, ${bgSat}%, 15%)`,       // Fondo Tarjetas Azul Marino (#0e2240)
    bgElevated: `hsl(${h}, ${bgSat}%, 21%)`,      // Fondo Elevado e Inputs (#15335e)
    border: `hsl(${h}, ${bgSat}%, 28%)`,          // Bordes bien definidos (#1e4680)
    textPrimary: `hsl(${h}, 20%, 96%)`,           // Texto claro fresco
    textMuted: `hsl(${h}, 25%, 70%)`,             // Texto secundario suavizado con tinte
  };
}