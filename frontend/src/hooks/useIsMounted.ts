import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export function useIsMounted(): MutableRefObject<boolean> {
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef;
}
