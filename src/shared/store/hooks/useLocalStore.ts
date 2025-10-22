import type { IReactionDisposer } from 'mobx';
import { useEffect, useRef } from 'react';

export type ILocalStore = {
  destroy(): void;
  reactions: IReactionDisposer[];
  initReactions(): void;
  clearReactions(): void;
};

const useLocalStore = <T extends ILocalStore & { _destroyed?: boolean }>(creator: () => T) => {
  const container = useRef<T | null>(null);

  if (!container.current) {
    container.current = creator();
  }

  useEffect(() => {
    if (container.current?._destroyed) {
      container.current.initReactions();
    }
 
    return () => {
      if (container.current) {
        container.current._destroyed = true;
        container.current.destroy();
      }
    };
  }, []);

  return container.current;
};

export default useLocalStore;
