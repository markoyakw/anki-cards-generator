import { useState, useEffect } from 'react';

const useSensorScreen = (): boolean => {
  const [isSensorScreen, setIsSensorScreen] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia('(hover: none) and (pointer: coarse)');

    const updateState = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSensorScreen(e.matches);
    };

    updateState(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateState as EventListener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(updateState);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateState as EventListener);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(updateState);
      }
    };
  }, []);

  return isSensorScreen;
};

export default useSensorScreen;
