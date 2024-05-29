import { useState, useEffect, useRef } from "react";

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(query);
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      mediaQueryList.addEventListener('change', handleChange);

      // Check the initial match state
      if (isFirstRender.current) {
        setMatches(mediaQueryList.matches);
        isFirstRender.current = false;
      }

      return () => {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    }
  }, [query]);

  return matches;
};

export default useMediaQuery;
