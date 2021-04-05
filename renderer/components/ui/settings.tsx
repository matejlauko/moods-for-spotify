import { styled } from '@/styles';

export const Row = styled('div', {
  display: 'grid',
  gridTemplateColumns: '$sizes$28 1fr $space$10',
  gridColumnGap: '$2',
  alignItems: 'center',
  py: '$2',

  '& > label': {
    fontWeight: '$medium',
  },
});
