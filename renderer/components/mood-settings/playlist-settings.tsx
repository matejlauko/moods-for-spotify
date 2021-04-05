import { PlaylistMood, useMoods } from '@/moods';
import { Select, SelectTrigger } from '@/ui';
import { Row } from '@/ui/settings';
import * as React from 'react';
import { usePlaylists } from './playlists-provider';

interface Props {
  mood: PlaylistMood;
}

const PlaylistSettings: React.FC<Props> = ({ mood }) => {
  const {
    actions: { updateCurrentMood },
  } = useMoods();
  const playlists = usePlaylists();

  const playlistItems = playlists.map(({ id, name }) => ({ id, name }));

  const selectedItem = mood.playlistId
    ? playlistItems.find(({ id }) => id === mood.playlistId)
    : null;

  return (
    <Row>
      <label id="select-playlist-label" htmlFor="select-playlist-trigger">
        Playlist
      </label>

      <SelectTrigger
        id="select-playlist"
        selectedText={selectedItem?.name}
        placeholder="Select playlist"
      >
        <Select
          items={playlistItems}
          getOptionLabel={(item) => item.name}
          onSelectionChange={(id) => {
            updateCurrentMood({ playlistId: id });
          }}
          selectedKey={mood.playlistId}
          searchPlaceholder="Search playslists"
        />
      </SelectTrigger>
    </Row>
  );
};

export default PlaylistSettings;
