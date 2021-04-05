import { styled } from '@/styles';
import BaseButton from './button';

const IconButton = styled(BaseButton, {
  size: '$10',

  '&:hover': {
    bg: '$bg_hover',

    '& svg': {
      color: '$icon_hover',
    },
  },

  variants: {
    size: {
      small: {
        size: '$8',
      },
    },
    active: {
      true: {
        '& svg': {
          color: '$icon_active',
        },
        '&:hover svg': {
          color: '$icon_active_hover',
        },
      },
    },
  },
});

export default IconButton;
