import { getMinImage } from '@/utils/image';
import { useApiQuery } from '@/libs/api';
import { useGenres } from '@/mood-settings';
import {
  MoodEnergy,
  MoodEnergyVals,
  MoodPositiveness,
  MoodPositivenessVals,
  MoodVocals,
  MoodVocalVals,
  RecommendationsMood,
  useMoods,
} from '@/moods';
import { styled } from '@/styles';
import {
  CancelButton,
  Select,
  SelectTrigger,
  Slider,
  SliderLabel,
  SliderLabels,
  Thumb,
  Track,
} from '@/ui';
import { Row } from '@/ui/settings';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import Adjust from './adjust';
import { useRecommendations } from './recommendations-provider';

interface Props {
  mood: RecommendationsMood;
}

const RecommendationSettings: React.FC<Props> = ({ mood }) => {
  return (
    <>
      <Genre mood={mood} />
      <Artist mood={mood} />
      <Energy mood={mood} />
      <Vocals mood={mood} />
      <Positiveness mood={mood} />
      <RecommendationExamples mood={mood} />
    </>
  );
};

export default RecommendationSettings;

type Section = React.FC<{ mood: RecommendationsMood }>;

const Genre: Section = ({ mood }) => {
  const genres = useGenres();
  const {
    actions: { updateCurrentMood },
  } = useMoods();

  const genreItems = genres.map((genre) => ({ id: genre, name: genre }));

  return (
    <Row>
      <label id="select-genre-label" htmlFor="select-genre-trigger">
        Genre
      </label>

      <SelectTrigger id="select-genre" selectedText={mood.genre}>
        <Select
          items={genreItems}
          getOptionLabel={(item) => item.name}
          onSelectionChange={(id) => {
            updateCurrentMood({ genre: id });
          }}
          selectedKey={mood.genre}
          searchPlaceholder="Search playslists"
        />
      </SelectTrigger>

      {mood.genre && (
        <CancelButton
          onClick={() => updateCurrentMood({ genre: undefined })}
          label="Cancel genre settings"
        />
      )}
    </Row>
  );
};

const Artist: Section = ({ mood }) => {
  const {
    actions: { updateCurrentMood },
  } = useMoods();
  const [search, changeSearch] = React.useState('');
  const [searchVal] = useDebounce(search, 500);
  const [list, changeList] = React.useState<SpotifyApi.ArtistObjectFull[]>([]);
  const query = useApiQuery();

  async function loadArtists() {
    const results = await query((api) =>
      api.searchArtists(search, { limit: 10 })
    );
    if (results?.artists?.items) {
      changeList(results.artists.items);
    }
  }

  React.useEffect(() => {
    if (!searchVal) {
      changeList([]);
      return;
    }
    loadArtists();
  }, [searchVal]);

  return (
    <Row>
      <label id="select-artist-label" htmlFor="select-artist-trigger">
        Artist
      </label>

      <SelectTrigger
        id="select-artist"
        selectedText={mood.artist?.name}
        placeholder="Select artist"
      >
        <Select<SpotifyApi.ArtistObjectFull>
          items={list}
          getOptionLabel={(item) => item.name}
          renderItem={(item) => <ArtistItem artist={item} />}
          onSelectionChange={(id) => {
            updateCurrentMood({
              artist: {
                id: id,
                name: list.find((artist) => artist.id === id)?.name || '',
              },
            });
          }}
          selectedKey={mood.artist?.id}
          searchPlaceholder="Search artists"
          onInputChange={changeSearch}
        />
      </SelectTrigger>

      {mood.artist && (
        <CancelButton
          onClick={() => updateCurrentMood({ artist: undefined })}
          label="Cancel artist settings"
        />
      )}
    </Row>
  );
};

const ArtistItem: React.FC<{ artist: SpotifyApi.ArtistObjectFull }> = ({
  artist,
}) => {
  const image = getMinImage(artist.images);

  return (
    <ArtistContainer>
      {image ? (
        <ArtistImg
          src={image.url}
          height={(image.height || 0) > 32 ? 32 : image.height}
          alt={artist.name}
        />
      ) : (
        <span />
      )}

      <ArtistName title={artist.name}>{artist.name}</ArtistName>

      <ArtistGenres title={artist.genres.join(', ')}>
        {artist.genres.join(', ')}{' '}
      </ArtistGenres>
    </ArtistContainer>
  );
};
const ArtistContainer = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  height: '$8',
  gridTemplateColumns: '$sizes$8 1fr $sizes$14',
  gridColumnGap: '$2',
  alignItems: 'center',
});
const ArtistImg = styled('img', {
  maxHeight: '$8',
  maxWidth: '100%',
  objectFit: 'cover',
});
const ArtistName = styled('p', {
  m: '0',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
});
const ArtistGenres = styled('p', {
  m: '0',
  fontSize: '$xs',
  color: '$text_secondary',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
});

const Energy: Section = ({ mood }) => {
  const {
    actions: { updateCurrentMood },
  } = useMoods();

  const value = mood.energy?.map(
    (e) => MoodEnergyVals.findIndex((v) => v === e) + 1
  ) || [1, 3];

  return (
    <Slider
      label="Energy"
      value={value}
      onChange={(value) => {
        const energy = value.map((v) => MoodEnergyVals[v - 1]) as [
          MoodEnergy,
          MoodEnergy
        ];
        updateCurrentMood({ energy });
      }}
    >
      <Row>
        <SliderLabel>Energy</SliderLabel>

        <div>
          <Track>
            <Thumb index={0} />
            <Thumb index={1} />
          </Track>

          <SliderLabels labels={MoodEnergyVals} />
        </div>
      </Row>
    </Slider>
  );
};

const Vocals: Section = ({ mood }) => {
  const {
    actions: { updateCurrentMood },
  } = useMoods();

  const value = mood.vocals?.map(
    (e) => MoodVocalVals.findIndex((v) => v === e) + 1
  ) || [1, 3];

  return (
    <Slider
      label="Vocals"
      value={value}
      onChange={(value) => {
        const vocals = value.map((v) => MoodVocalVals[v - 1]) as [
          MoodVocals,
          MoodVocals
        ];
        updateCurrentMood({ vocals });
      }}
    >
      <Row>
        <SliderLabel>Vocals</SliderLabel>

        <div>
          <Track>
            <Thumb index={0} />
            <Thumb index={1} />
          </Track>

          <SliderLabels labels={MoodVocalVals} />
        </div>
      </Row>
    </Slider>
  );
};

const Positiveness: Section = ({ mood }) => {
  const {
    actions: { updateCurrentMood },
  } = useMoods();

  const value = mood.positiveness?.map(
    (e) => MoodPositivenessVals.findIndex((v) => v === e) + 1
  ) || [1, 3];

  return (
    <Slider
      label="Positiveness"
      value={value}
      onChange={(value) => {
        const positiveness = value.map((v) => MoodPositivenessVals[v - 1]) as [
          MoodPositiveness,
          MoodPositiveness
        ];
        updateCurrentMood({ positiveness });
      }}
    >
      <Row>
        <SliderLabel>Positiveness</SliderLabel>

        <div>
          <Track>
            <Thumb index={0} />
            <Thumb index={1} />
          </Track>

          <SliderLabels labels={MoodPositivenessVals} />
        </div>
      </Row>
    </Slider>
  );
};

const RecommendationExamples: Section = ({ mood }) => {
  const { recommendations, recommendationsCount } = useRecommendations(mood);

  return (
    <Row css={{ alignItems: 'start' }}>
      <label>Recommended tracks</label>

      <div>
        {(recommendationsCount || 0) > 0 && (
          <RecommendedList>
            {recommendations?.tracks.map((track) => (
              <li key={track.id}>
                {track.artists.map(({ name }) => name).join(', ')} -{' '}
                {track.name}
              </li>
            ))}
          </RecommendedList>
        )}

        {(recommendationsCount || 0) > 5 && (
          <RecommendedMore>
            .. and {recommendationsCount! - 5} more
          </RecommendedMore>
        )}

        {recommendationsCount !== undefined && (
          <Adjust recommendationsCount={recommendationsCount} />
        )}
      </div>
    </Row>
  );
};

const RecommendedList = styled('ul', {
  listStyle: 'none',
  m: '0',
  p: '0',
  mb: '$4',
  userSelect: 'text',
});
const RecommendedMore = styled('p', {
  mt: '-$3',
  mb: '$4',
  color: '$text_secondary',
});
