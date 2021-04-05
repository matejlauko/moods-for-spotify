import { SizeVal, styled, theme } from '@/styles';
import * as React from 'react';

const Svg = styled('svg', {});

interface Props extends React.ComponentProps<typeof Svg> {
  size?: SizeVal;
}

const Icon: React.FC<Props> = ({ size = '5', color = '$icon', ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={theme.sizes![size]}
    height={theme.sizes![size]}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
    role="img"
    css={{
      color,
      transition: 'all 0.2s',
    }}
    {...props}
  />
);

export default Icon;
