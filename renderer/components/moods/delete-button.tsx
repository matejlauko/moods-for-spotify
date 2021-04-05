import { styled } from '@/styles';
import { Icon, IconButton } from '@/ui';
import * as React from 'react';
import { useMoods } from './moods-provider';

const DeleteMoodButton: React.FC = () => {
  const {
    actions: { deleteCurrentMood },
  } = useMoods();

  const handleClick = () => {
    deleteCurrentMood();
  };

  return (
    <Button
      onClick={handleClick}
      aria-label="Delete mood"
      className="delete-mood"
      tabIndex={-1}
    >
      <Icon>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </Icon>
    </Button>
  );
};

export default DeleteMoodButton;

const Button = styled(IconButton, {
  size: '$6',
  p: '0',
  position: 'absolute',
  top: '-$1',
  right: '-$1',
  opacity: 0,

  transition: 'all 0.2s, opacity 0.3s ease-in',
});
