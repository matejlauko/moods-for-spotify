import { styled } from '@/styles';
import * as React from 'react';

const StyledButton = styled('button', {
  appearance: 'none',
  userSelect: 'none',
  outline: 'none',
  borderRadius: '$def',
  fontWeight: '$bold',
  bg: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
  justifyContent: 'center',
  alignItems: 'center',
  color: '$text',
  fontSize: '$md',

  transition: 'all 0.2s',

  '&:focus-visible': {
    boxShadow: '$focus',
  },
});

const Button: React.FC<
  React.ComponentProps<typeof StyledButton>
> = React.forwardRef((props, ref) => (
  <StyledButton ref={ref} type="button" {...props} />
));

export default Button;
