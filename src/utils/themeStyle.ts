import type React from 'react';
import type { ThemePalette } from './themeGenerator';

/** Variables CSS que consumen las clases bg-theme-*, text-theme-*, btn-theme-primary (index.css). */
export const paletteToStyle = (palette: ThemePalette): React.CSSProperties =>
  ({
    '--color-primary': palette.primary,
    '--color-primary-hover': palette.primaryHover,
    '--color-bg-base': palette.bgBase,
    '--color-bg-surface': palette.bgSurface,
    '--color-bg-elevated': palette.bgElevated,
    '--color-border': palette.border,
    '--color-text-primary': palette.textPrimary,
    '--color-text-muted': palette.textMuted,
  }) as React.CSSProperties;
