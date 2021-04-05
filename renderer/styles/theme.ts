import { TTheme } from '@stitches/core';

const baseColors = {
  white: '#fff',
  gray100: 'hsl(206,11%,92%)',
  gray200: 'hsl(206,10%,76%)',
  gray300: 'hsl(206,10%,44%)',
  gray400: 'hsl(206,10%,20%)',
  gray500: 'hsl(206, 10%, 5%)',

  spotify: '#1DB954',
  spotify_hover: '#1ed760',
  spotify_focus: 'rgb(29, 185, 84, 0.3)',

  orange100: 'rgba(251, 211, 141, 0.16)',
  orange200: 'rgba(214, 158, 46, 0.6)',
  red100: 'rgba(254, 178, 178, 0.16)',
  red200: 'rgba(229, 62, 62, 0.6)',

  gray_trans: 'rgba(56, 59, 68, 0.9)',
  black_trans: 'rgba(0, 0, 0, 0.5)',
};

const appColors: TTheme['colors'] = {
  text: baseColors.white,
  text_reversed: baseColors.gray500,
  text_secondary: baseColors.gray100,

  icon: baseColors.gray200,
  icon_hover: baseColors.white,
  icon_active: baseColors.spotify,
  icon_active_hover: baseColors.spotify_hover,

  border: baseColors.gray300,

  bg_home: baseColors.gray400,
  bg_other: baseColors.gray400,
  bg_bar: baseColors.black_trans,
  bg_hover: 'rgba(255,255,255,0.05)',
  bg_hover_reversed: 'rgba(255,255,255,0.7)',
  bg_popover: 'rgba(56, 59, 68, 0.97)',

  focus: baseColors.white,

  warning_bg: baseColors.orange100,
  warning_border: baseColors.orange200,
  error_bg: baseColors.red100,
  error_border: baseColors.red200,
};

const space = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
};

export const theme: TTheme = {
  colors: {
    ...baseColors,
    ...appColors,
  },
  space,
  sizes: {
    ...space,
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    18: '4.5rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    40: '10rem',
  },
  fontSizes: {
    xs: '0.6875rem',
    sm: '0.815rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.25rem',
  },
  radii: {
    sm: '0.5rem',
    def: '1rem',
    full: '9999px',
  },
  shadows: {
    focus: '0 0 0 3px $colors$focus',
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
};

export type Theme = typeof theme;
export type ColorVal = keyof Theme['colors'] | (string & {});
export type SpaceVal = keyof Theme['space'] | (string & {});
export type SizeVal = keyof Theme['sizes'] | (string & {});
export type FontSizeVal = keyof Theme['fontSizes'] | (string & {});
export type BorderRadiusVal = keyof Theme['radii'] | (string & {});
