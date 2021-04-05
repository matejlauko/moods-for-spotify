import { styled } from '@/styles';
import { useFocusRing } from '@react-aria/focus';
import { SliderAria, useSlider, useSliderThumb } from '@react-aria/slider';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SliderState, useSliderState } from '@react-stately/slider';
import * as React from 'react';

interface SliderContextVal {
  state: SliderState;
  labelProps: SliderAria['labelProps'];
  trackProps: SliderAria['trackProps'];
  trackRef: React.RefObject<HTMLDivElement>;
}
// @ts-ignore
const SliderContext = React.createContext<SliderContextVal>();

interface Props {
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
}

export const Slider: React.FC<Props> = ({
  label,
  value,
  onChange,
  children,
}) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const state = useSliderState({
    minValue: 1,
    maxValue: 100,
    step: 1,
    /* Convert stored 1 - 3 scale values to internal 1 - 100 scale */
    defaultValue: [
      Math.max((value[0] - 1) * 50, 1),
      Math.max((value[1] - 1) * 50, 1),
    ],
    onChangeEnd: (value) => {
      /* Convert internal 1 - 100 scale to external 1 - 3 scale */
      // Calculate quandrant of value (we want 25 - 75 to be middle)
      const quadrant0 = Math.min(Math.ceil(value[0] / (100 / 4)), 4);
      const quadrant1 = Math.min(Math.ceil(value[1] / (100 / 4)), 4);
      // Convert 2 and 3 quandrat to val 2
      const val0 = quadrant0 === 1 ? 1 : quadrant0 < 4 ? 2 : 3;
      const val1 = quadrant1 === 1 ? 1 : quadrant1 < 4 ? 2 : 3;

      // Call external change listener with external values
      onChange([val0, val1]);

      // Fix local thumb positions with 3 point values
      state.setThumbValue(0, Math.max((val0 - 1) * 50, 1));
      state.setThumbValue(1, Math.max((val1 - 1) * 50, 1));
    },
    numberFormatter: new Intl.NumberFormat(),
  });

  const { groupProps, trackProps, labelProps } = useSlider(
    { label },
    state,
    trackRef
  );

  return (
    <div {...groupProps}>
      <SliderContext.Provider
        value={{ state, labelProps, trackProps, trackRef }}
      >
        {children}
      </SliderContext.Provider>
    </div>
  );
};

export const SliderLabel: React.FC = ({ children }) => {
  const { labelProps } = React.useContext(SliderContext);

  return <label {...labelProps}>{children}</label>;
};

// When track isn't rendered yet, use dummy static track width
function getTrackWidth(trackRef: React.RefObject<HTMLDivElement>) {
  return trackRef.current?.getBoundingClientRect().width || 368;
}

function getThumbPositon(
  index: number,
  state: SliderState,
  trackWidth: number
) {
  const thumbVal = state.getThumbValue(index);
  const otherThumbVal = state.getThumbValue(index === 0 ? 1 : 0);
  let percentVal = state.getThumbPercent(index);

  // To display last thumb directly at the end of track - substract half the thumb width from track width
  const adjustedTrackWidth = Math.max(trackWidth - 10, 0);

  let position = percentVal * adjustedTrackWidth;

  if (index === 0 && thumbVal === 50 && otherThumbVal === 50)
    position = position - 7;
  if (index === 0 && thumbVal === 100) position = position - 14;

  if (index === 1 && thumbVal === 50 && otherThumbVal === 50)
    position = position + 7;
  if (index === 1 && thumbVal === 1) position = position + 14;

  return position;
}

export const Track: React.FC = ({ children }) => {
  const { trackProps, trackRef, state } = React.useContext(SliderContext);

  const trackWidth = getTrackWidth(trackRef);
  const thumb1Pos = getThumbPositon(0, state, trackWidth);
  const thumb2Pos = getThumbPositon(1, state, trackWidth);

  const activeTrackWidth = trackWidth - (trackWidth - thumb2Pos) - thumb1Pos;

  return (
    <TrackContainer {...trackProps} ref={trackRef}>
      <TrackBase />
      <ActiveTrack
        style={{
          transform: `translateX(${thumb1Pos}px)`,
          width: `${activeTrackWidth}px`,
        }}
      />

      {children}
    </TrackContainer>
  );
};

const TrackContainer = styled('div', {
  position: 'relative',
  height: '$6',
});
const TrackBase = styled('div', {
  position: 'absolute',
  backgroundColor: '$border',
  height: '2px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '100%',
  borderRadius: '$def',
});
const ActiveTrack = styled(TrackBase, {
  backgroundColor: '$spotify',
});

export const Thumb: React.FC<{ index: number }> = ({ index }) => {
  const { state, trackRef } = React.useContext(SliderContext);

  const inputRef = React.useRef(null);

  const { thumbProps, inputProps } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  const { focusProps, isFocusVisible } = useFocusRing();

  const trackWidth = getTrackWidth(trackRef);
  const posX = getThumbPositon(index, state, trackWidth);

  return (
    <StyledThumb
      {...thumbProps}
      focused={isFocusVisible}
      dragging={state.isThumbDragging(index)}
      style={{
        transform: `translateX(${posX}px)`,
      }}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </StyledThumb>
  );
};

const StyledThumb = styled('div', {
  position: 'absolute',
  left: 0,
  top: 'calc(($sizes$6 - $sizes$4) / 2)',
  transition: 'transform 0.1s ease-out',
  size: '$4',
  borderRadius: '$full',
  bg: '$icon',
  variants: {
    focused: {
      true: {
        boxShadow: '0 0 0 2px $colors$focus',
      },
    },
    dragging: {
      true: {
        bg: '$icon_hover',
        boxShadow: '$focus',
      },
    },
  },
});

export const SliderLabels: React.FC<{ labels: string[] }> = ({ labels }) => {
  return (
    <LabelsContainer>
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </LabelsContainer>
  );
};

const LabelsContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '$sm',

  '& :nth-child(2)': {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
});
