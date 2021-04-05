import { InternalCSS } from '@stitches/core';
import * as React from 'react';
import Icon from './icon';
import IconButton from './icon-button';

const CancelButton: React.FC<{
  onClick: () => void;
  label: string;
  css?: InternalCSS;
}> = ({ onClick, label, css }) => {
  return (
    <IconButton onClick={onClick} aria-label={label} css={css}>
      <Icon>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </Icon>
    </IconButton>
  );
};

export default CancelButton;
