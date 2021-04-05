import { styled } from '@/styles';

interface Props {
  recommendationsCount: number;
}

const AdjustRecommendationSettings: React.FC<Props> = ({
  recommendationsCount,
}) => {
  if (recommendationsCount < 6 && recommendationsCount > 0) {
    return (
      <AdjustBox type="some">
        Spotify recommended only <b>{recommendationsCount}</b>{' '}
        {recommendationsCount === 1 ? 'song' : 'songs'}..
        <br />
        Try adjusting settings to get more music!
      </AdjustBox>
    );
  }

  if (recommendationsCount === 0) {
    return (
      <AdjustBox type="none">
        Spotify says there's no music for you :(
        <br />
        Try to change things up!
      </AdjustBox>
    );
  }

  return null;
};

const AdjustBox = styled('div', {
  borderWidth: '2px',
  fontWeight: '500',
  p: '$2',
  // color: '#FEF3C7',
  borderRadius: '$sm',

  variants: {
    type: {
      some: {
        bg: '$warning_bg',
        borderColor: '$warning_border',
      },
      none: {
        bg: '$error_bg',
        borderColor: '$error_border',
      },
    },
  },
});

export default AdjustRecommendationSettings;
