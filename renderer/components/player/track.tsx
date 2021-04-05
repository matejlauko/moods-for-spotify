import { getMinImage } from '@/utils/image';
import { styled } from '@/styles';
import * as React from 'react';
import Like from './like';
import { usePlayer } from './player-provider';
import { useApiQuery } from '@/libs/api';

const Track: React.FC = () => {
  const { state } = usePlayer();
  const query = useApiQuery();
  const [displayedTrack, changeDisplayedTrack] = React.useState<
    SpotifyApi.TrackObjectSimplified | SpotifyApi.TrackObjectFull | null
  >(state.currentPlayback?.item || null);

  async function loadLastTrack() {
    const response = await query((api) =>
      api.getMyRecentlyPlayedTracks({ limit: 1 })
    );
    if (response?.items.length) {
      changeDisplayedTrack(response.items[0].track);
    }
  }

  React.useEffect(() => {
    // Mirror playing track in local state
    if (state.currentPlayback?.item) {
      changeDisplayedTrack(state.currentPlayback?.item);
      return;
    }
    // Load last track if previous is not in local state
    if (!displayedTrack) {
      loadLastTrack();
    }
  }, [state.currentPlayback?.item]);

  const image = getPlayingImage(
    (displayedTrack as SpotifyApi.TrackObjectFull)?.album
      ? (displayedTrack as SpotifyApi.TrackObjectFull)
      : null
  );

  return (
    <Container>
      {displayedTrack ? (
        <>
          {image ? (
            <Artwork
              src={image.url}
              height={`${image.height}px`}
              width={`${image.width}px`}
            />
          ) : (
            <span />
          )}

          <div>
            <TrackName>{displayedTrack.name}</TrackName>
            <Artists>
              {displayedTrack.artists.map(({ name }) => name).join(', ')}
            </Artists>
          </div>

          <LikeBox>
            <Like />
          </LikeBox>
        </>
      ) : (
        <NoPlayback>
          No active song..
          <br />
          <b>Play something good</b>
        </NoPlayback>
      )}
    </Container>
  );
};

export default Track;

function getPlayingImage(track: SpotifyApi.TrackObjectFull | null) {
  return getMinImage(track?.album.images);
}

const Container = styled('div', {
  display: 'grid',
  height: '$20',
  gridColumnGap: '$4',
  gridTemplateColumns: 'auto 1fr auto',
  gridAutoFlow: 'column',
  alignItems: 'center',
  px: '$4',
});

const Artwork = styled('img', {
  size: '$16',
});

const TrackName = styled('p', {
  fontSize: '$lg',
  fontWeight: '$bold',
  mt: '0',
  mb: '$1',
});
const Artists = styled('p', {
  fontSize: '$sm',
  color: '$text_secondary',
  m: '0',
});

const LikeBox = styled('div', {
  alignSelf: 'center',
});

const NoPlayback = styled('p', {
  gridArea: '1 / 1 / span 2 / span 3',
  textAlign: 'center',
});
