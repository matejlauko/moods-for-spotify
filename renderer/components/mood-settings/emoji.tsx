import { styled, theme } from '@/styles';
import { Button } from '@/ui';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import {
  DismissButton,
  OverlayContainer,
  OverlayProvider,
  OverlayTriggerAria,
  useModal,
  useOverlay,
  useOverlayPosition,
  useOverlayTrigger,
} from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { CustomEmoji, Emoji as _Emoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import * as React from 'react';

interface PopoverContextVal extends OverlayTriggerAria {
  state: OverlayTriggerState;
  overlayRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

// @ts-ignore
const PopoverContext = React.createContext<PopoverContextVal>();

interface Props {
  currentEmoji: string;
  onSelect: (emoji: string) => void;
  labelledby: string;
}

export const EmojiPicker: React.FC<Props> = ({
  currentEmoji = '',
  onSelect,
  labelledby,
  children,
}) => {
  return (
    <PopoverBase>
      <EmojiButton aria-labelledby={labelledby}>{children}</EmojiButton>

      <Popover>
        {({ close }) => (
          <Picker
            color={theme.colors!.spotify as string}
            emojiSize={24}
            onSelect={(emoji) => {
              if (emoji.colons || emoji.id) {
                onSelect(emoji.colons || emoji.id!);

                close();
              }
            }}
            theme="auto"
            title="Pick mood emoji"
            recent={['']}
            emoji={currentEmoji}
            custom={[SpotifyEmoji]}
          />
        )}
      </Popover>
    </PopoverBase>
  );
};

const EmojiButton: React.FC = ({ children }) => {
  const { triggerProps, triggerRef, state } = React.useContext(PopoverContext);

  return (
    <StyledEmojiButton
      {...triggerProps}
      ref={triggerRef}
      onMouseDown={() => {
        if (!state.isOpen) {
          state.open();
        }
      }}
    >
      {children}
    </StyledEmojiButton>
  );
};

const StyledEmojiButton = styled(Button, {
  borderRadius: '$full',
  p: '$2',
  '&:hover': {
    bg: '$bg_hover',
  },
});

const PopoverBase: React.FC = ({ children }) => {
  let state = useOverlayTriggerState({});
  let triggerRef = React.useRef<HTMLButtonElement>(null);
  let overlayRef = React.useRef<HTMLDivElement>(null);

  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  );

  let { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'bottom left',
    offset: 5,
    isOpen: state.isOpen,
  });

  return (
    <PopoverContext.Provider
      value={{
        overlayProps: mergeProps(overlayProps, positionProps),
        overlayRef,
        triggerProps,
        triggerRef,
        state,
      }}
    >
      <OverlayProvider>{children}</OverlayProvider>
    </PopoverContext.Provider>
  );
};

const Popover: React.FC<{
  children: (state: OverlayTriggerState) => React.ReactNode;
}> = ({ children }) => {
  const { state } = React.useContext(PopoverContext);

  return state.isOpen ? (
    <PopoverContent>{children(state)}</PopoverContent>
  ) : null;
};

const PopoverContent: React.FC = ({ children }) => {
  const { overlayProps, overlayRef, state } = React.useContext(PopoverContext);

  let { overlayProps: _overlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      isDismissable: true,
    },
    overlayRef
  );

  // Hide content outside the modal from screen readers.
  let { modalProps } = useModal();

  // Get props for the dialog and its title
  let { dialogProps, titleProps } = useDialog({}, overlayRef);

  return (
    <OverlayContainer>
      <FocusScope restoreFocus>
        <PopoverContainer
          {...mergeProps(_overlayProps, dialogProps, overlayProps, modalProps)}
          ref={overlayRef}
        >
          {children}
          <DismissButton onDismiss={state.close} />
        </PopoverContainer>
      </FocusScope>
    </OverlayContainer>
  );
};

const PopoverContainer = styled('div', {
  outline: 'none',
  '.emoji-mart-emoji:focus': {
    outline: 'none',
    '&:before': {
      zIndex: 0,
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#444',
      borderRadius: '100%',
    },
  },
});

const SpotifyEmoji: CustomEmoji = {
  name: 'Spotify',
  short_names: ['spotify'],
  keywords: ['spotify'],
  imageUrl: '/images/spotify-icon-green.png',
};

export const Emoji: typeof _Emoji = ({ emoji, ...restProps }) => {
  return (
    <_Emoji
      emoji={emoji === ':spotify:' ? SpotifyEmoji : emoji}
      {...restProps}
    />
  );
};
