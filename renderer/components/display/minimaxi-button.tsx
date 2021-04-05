import { useAppState } from '@/app-state';
import { Icon, IconButton } from '@/ui';
import { ipcRenderer } from 'electron';
import * as React from 'react';

const MiniMaxiButton: React.FC = () => {
  const { isMiniMode, toggleMiniMode } = useAppState();

  const handleClick = () => {
    ipcRenderer.invoke('minimode-set', !isMiniMode);
    toggleMiniMode();
  };

  return (
    <IconButton
      onClick={handleClick}
      aria-label={isMiniMode ? 'Switch to full mode' : 'Switch to mini mode'}
      title={isMiniMode ? 'Switch to full mode' : 'Switch to mini mode'}
      size={isMiniMode ? 'small' : undefined}
      active={isMiniMode}
    >
      <Icon>
        {isMiniMode ? (
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        ) : (
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        )}
      </Icon>
    </IconButton>
  );
};

export default MiniMaxiButton;
