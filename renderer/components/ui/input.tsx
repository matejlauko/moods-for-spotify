import { styled } from '@/styles';
import * as React from 'react';

const StyledInput = styled('input', {
  width: '100%',
  outline: 'none',
  position: 'relative',
  appearance: 'none',
  transition: 'all 0.2s',
  px: '$4',
  height: '$10',
  borderRadius: '$def',
  borderWidth: '1px',
  color: '$text',
  bg: '$bg_hover',
  fontSize: '$md',

  '&:focus-visible': {
    boxShadow: '$focus',
  },
});

const Input: React.FC<
  React.ComponentProps<typeof StyledInput>
> = React.forwardRef((props, ref) => (
  <StyledInput ref={ref} type="text" {...props} />
));

export default Input;
