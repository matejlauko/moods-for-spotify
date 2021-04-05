import { isPlaylistMood, useMoods } from '@/moods';
import {
  RecommendationSettings,
  RecommendationsProvider,
} from '@/recommendations';
import { styled } from '@/styles';
import { Row } from '@/ui/settings';
import * as React from 'react';
import { Emoji, EmojiPicker } from './emoji';
import { GenresProvider } from './genres-provider';
import PlaylistSettings from './playlist-settings';
import { PlaylistsProvider } from './playlists-provider';
import Switch from './switch';

const Settings = () => {
  const {
    actions: { updateCurrentMood },
    currentMood,
  } = useMoods();

  if (!currentMood) return null;

  return (
    <Container>
      <Row>
        <label id="settings-label-emoji">Emoji</label>
        <EmojiPicker
          currentEmoji={currentMood.emoji}
          onSelect={(emoji) => updateCurrentMood({ emoji })}
          labelledby="settings-label-emoji"
        >
          <Emoji emoji={currentMood.emoji} size={30} />
        </EmojiPicker>
      </Row>

      <Row>
        <label id="settings-label-type">Type</label>

        <Switch
          type={currentMood.configType}
          onSwitch={(type) => updateCurrentMood({ configType: type })}
          labelledby="settings-label-type"
        />
      </Row>

      <GenresProvider>
        <PlaylistsProvider>
          <RecommendationsProvider isSettings>
            {isPlaylistMood(currentMood) ? (
              <PlaylistSettings mood={currentMood} />
            ) : (
              <RecommendationSettings mood={currentMood} />
            )}
          </RecommendationsProvider>
        </PlaylistsProvider>
      </GenresProvider>
    </Container>
  );
};

export default Settings;

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  px: '$4',
  '& > *': {
    mb: '$2',
  },
});
