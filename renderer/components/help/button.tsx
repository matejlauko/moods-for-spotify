import { useAppState } from '@/app-state';
import { Icon, IconButton } from '@/ui';
import * as React from 'react';

const HelpButton: React.FC = () => {
  const { isMiniMode } = useAppState();

  const handleClick = () => {
    window.open(
      process.env.NODE_ENV === 'production' ? '/about.html' : '/about'
    );
  };

  return (
    <IconButton
      onClick={handleClick}
      aria-label="Open help"
      title="Help"
      size={isMiniMode ? 'small' : undefined}
    >
      <Icon>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </Icon>
    </IconButton>
  );
};

export default HelpButton;
