import { createCss } from '@stitches/react';
import { ColorVal, SizeVal, SpaceVal, theme } from './theme';

export const { styled, css, global, keyframes, getCssString } = createCss({
  theme,
  utils: {
    m: (config) => (value: SpaceVal) => ({
      marginBlockStart: value,
      marginBlockEnd: value,
      marginInlineStart: value,
      marginInlineEnd: value,
    }),
    mt: (config) => (value: SpaceVal) => ({
      marginBlockStart: value,
    }),
    mr: (config) => (value: SpaceVal) => ({
      marginInlineEnd: value,
    }),
    mb: (config) => (value: SpaceVal) => ({
      marginBlockEnd: value,
    }),
    ml: (config) => (value: SpaceVal) => ({
      marginInlineStart: value,
    }),
    mx: (config) => (value: SpaceVal) => ({
      marginInlineStart: value,
      marginInlineEnd: value,
    }),
    my: (config) => (value: SpaceVal) => ({
      marginBlockStart: value,
      marginBlockEnd: value,
    }),
    p: (config) => (value: SpaceVal) => ({
      paddingBlockStart: value,
      paddingBlockEnd: value,
      paddingInlineStart: value,
      paddingInlineEnd: value,
    }),
    pt: (config) => (value: SpaceVal) => ({
      paddingBlockStart: value,
    }),
    pr: (config) => (value: SpaceVal) => ({
      paddingInlineEnd: value,
    }),
    pb: (config) => (value: SpaceVal) => ({
      paddingBlockEnd: value,
    }),
    pl: (config) => (value: SpaceVal) => ({
      paddingInlineStart: value,
    }),
    px: (config) => (value: SpaceVal) => ({
      paddingInlineStart: value,
      paddingInlineEnd: value,
    }),
    py: (config) => (value: SpaceVal) => ({
      paddingBlockStart: value,
      paddingBlockEnd: value,
    }),
    // A property for applying width/height together
    size: (config) => (value: SizeVal) => ({
      width: value,
      height: value,
    }),
    bg: (config) => (value: ColorVal) => ({
      backgroundColor: value,
    }),
  },
});
