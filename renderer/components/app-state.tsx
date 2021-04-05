import { authStore } from '@/libs/auth';
import { useRouter } from 'next/router';
import * as React from 'react';

// @ts-ignore
const AppStateContext = React.createContext<{
  isLoggedIn: boolean;
  isInitialized: boolean;
  setInitialized: () => void;
  isMiniMode: boolean;
  toggleMiniMode: () => void;
}>();

export const useAppState = () => React.useContext(AppStateContext);

const AppState: React.FC = ({ children }) => {
  const { pathname } = useRouter();
  const [isLoggedIn, changeLoggedIn] = React.useState(
    !!authStore.loadAuth().accessToken
  );
  const [isInitialized, changeInitialized] = React.useState(false);
  const [isMiniMode, changeMiniMode] = React.useState(false);

  function setInitialized() {
    changeInitialized(true);
  }
  function toggleMiniMode() {
    changeMiniMode((on) => !on);
  }

  React.useEffect(() => {
    changeLoggedIn(!!authStore.loadAuth().accessToken);
  }, [pathname]);

  return (
    <AppStateContext.Provider
      value={{
        isLoggedIn,
        isInitialized,
        setInitialized,
        isMiniMode,
        toggleMiniMode,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppState;
