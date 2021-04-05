import { global } from './stitches.config';

export const globalStyles = global({
  '*, *:after, *:before': {
    boxSizing: 'border-box',
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: '$colors$border',
  },
  html: {
    height: '100%',
    color: '$text',
    overflowX: 'hidden',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
    touchAction: 'manipulation',
    textRendering: 'optimizeLegibility',
    '-webkit-font-smoothing': 'antialiased',
    '-webkit-text-size-adjust': '100%',
    userSelect: 'none',
  },
  body: {
    margin: 0,
    minHeight: '100%',
    height: '100%',
  },
  '#__next': {
    height: '100%',
  },
  'img, svg': {
    display: 'block',
  },
  a: {
    cursor: 'default',
    color: '$text',
  },
  'span, strong': {
    verticalAlign: 'middle',
  },
});
