import { useAppState } from '@/app-state';
import { MiniMaxiButton, PinButton } from '@/display';
import { HelpButton } from '@/help';
import { styled } from '@/styles';
import * as React from 'react';
import Loading from './loading';

interface Props {
  title?: React.ReactNode;
  hasLoading?: boolean;
  children: React.ReactNode;
}

export const HomeLayout: React.FC<Pick<Props, 'title'>> = ({
  title = null,
  children,
}) => {
  const { isInitialized } = useAppState();

  return (
    <Container>
      <Bg />

      <Titlebar>
        <Heading>{title}</Heading>

        {isInitialized && (
          <Controls>
            <MiniMaxiButton />
            <PinButton />

            <HelpButton />
          </Controls>
        )}
      </Titlebar>

      <div>{!isInitialized ? <Loading /> : children}</div>
    </Container>
  );
};

export const PageLayout: React.FC<Props> = ({
  title = null,
  hasLoading = false,
  children,
}) => {
  const { isInitialized } = useAppState();
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Container ref={ref} css={{ height: 'auto' }}>
      <Bg />

      <Titlebar>
        <Heading>{title}</Heading>
      </Titlebar>

      <div>{hasLoading && !isInitialized ? <Loading /> : children}</div>
    </Container>
  );
};

export const SupportingLayout: React.FC<Pick<Props, 'hasLoading'>> = ({
  hasLoading = false,
  children,
}) => {
  const { isInitialized } = useAppState();

  return (
    <Container>
      <Bg />

      <Titlebar>
        <Controls>
          <HelpButton />
        </Controls>
      </Titlebar>

      <div>{hasLoading && !isInitialized ? <Loading /> : children}</div>
    </Container>
  );
};

const Container = styled('div', {
  height: '100%',
  display: 'grid',
  gridTemplateRows: '$sizes$10 1fr',
});

const Bg = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  bg: '$bg_home',
  zIndex: -1,
});

const Titlebar = styled('div', {
  userSelect: 'none',
  WebkitAppRegion: 'drag',
  display: 'grid',
  gridColumnGap: '$2',
  gridAutoFlow: 'column',
  gridTemplateColumns: '1fr min-content 1fr',
  justifyContent: 'space-between',
  alignItems: 'center',
  pr: '$2',
});

const Heading = styled('h1', {
  gridColumn: 2,
  fontSize: '$lg',
  m: '0',
  color: '$text_secondary',
});

const Controls = styled('div', {
  gridColumn: 3,
  justifySelf: 'end',
  display: 'grid',
  gridAutoFlow: 'column',
  gridColumnGap: '$1',
});
