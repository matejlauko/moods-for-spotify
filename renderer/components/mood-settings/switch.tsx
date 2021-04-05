import { MoodConfigType } from '@/moods';
import { styled } from '@/styles';
import { useFocusRing } from '@react-aria/focus';
import { useSwitch } from '@react-aria/switch';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useToggleState } from '@react-stately/toggle';
import * as React from 'react';

interface Props {
  type: MoodConfigType;
  onSwitch: (type: MoodConfigType) => void;
  labelledby: string;
}

const Switch: React.FC<Props> = ({ type, onSwitch, labelledby }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const state = useToggleState({
    isSelected: type === MoodConfigType.RECOMMEND,
    onChange: (isSelected) =>
      onSwitch(isSelected ? MoodConfigType.RECOMMEND : MoodConfigType.PLAYLIST),
  });
  const { inputProps } = useSwitch(
    { 'aria-labelledby': labelledby },
    state,
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <Wrapper>
      <Text
        onClick={() => state.setSelected(false)}
        selected={!state.isSelected}
      >
        playlist
      </Text>

      <label>
        <VisuallyHidden>
          <input ref={ref} {...inputProps} {...focusProps} />
        </VisuallyHidden>

        <Box aria-hidden="true" focused={isFocusVisible}>
          <svg width="100%" height="100%">
            <Circle
              cx={state.isSelected ? 46 : 14}
              cy={14}
              r={10}
              fill="currentColor"
            />
          </svg>
        </Box>
      </label>

      <Text onClick={() => state.setSelected(true)} selected={state.isSelected}>
        recommend
      </Text>
    </Wrapper>
  );
};

export default Switch;

const Wrapper = styled('div', {
  display: 'grid',
  gridColumnGap: '$4',
  gridAutoFlow: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  justifySelf: 'start',
});

const Box = styled('div', {
  width: '$16',
  height: '$8',
  bg: '$bg_hover',
  borderWidth: '2px',
  borderRadius: '$full',
  variants: {
    focused: {
      true: {
        boxShadow: '$focus',
      },
    },
  },
});

const Circle = styled('circle', {
  color: '$spotify',
});

const Text = styled('span', {
  fontWeight: '$bold',
  transition: 'text-shadow 0.2s',
  variants: {
    selected: {
      true: {
        color: '$spotify',
      },
    },
  },
});
