import { useAppState } from '@/app-state';
import { MoodSettingsButton } from '@/mood-settings';
import { isPlaylistMood, MoodsList, useMoods } from '@/moods';
import {
  AdjustRecommendationSettings,
  useRecommendations,
} from '@/recommendations';
import { styled } from '@/styles';
import * as React from 'react';

const MoodsPlayer = () => {
  const {
    state: { moods },
    currentMood,
  } = useMoods();
  const { isMiniMode } = useAppState();

  const { recommendationsCount } = useRecommendations(
    !currentMood || isPlaylistMood(currentMood) ? null : currentMood
  );

  return (
    <MoodsContainer>
      {moods.length === 0 && (
        <div>
          <strong>Setup music for all your moods</strong>
          <Pointer>👉</Pointer>
          <MoodSettingsButton />
        </div>
      )}

      <MoodsList />

      {!isMiniMode &&
        currentMood &&
        !isPlaylistMood(currentMood) &&
        recommendationsCount !== undefined && (
          <AdjustRecommendationSettings
            recommendationsCount={recommendationsCount}
          />
        )}
    </MoodsContainer>
  );
};

export default MoodsPlayer;

const MoodsContainer = styled('div', {
  display: 'grid',
  gridTemplateRows: '1fr max-content',
  alignItems: 'center',
  py: '$2',
  justifyItems: 'center',
});

const Pointer = styled('span', {
  fontSize: '24px',
  lineHeight: 1,
  verticalAlign: 'middle',
  display: 'inline-block',
  m: '$2',
});
