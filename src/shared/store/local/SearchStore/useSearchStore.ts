
import useLocalStore from '@store/hooks/useLocalStore';
import { useRootStore } from '@providers/RootStoreContext';
import SearchStore from './SearchStore';

const useSearchStore = () => {  
  const rootStore = useRootStore();
  
  const searchStore = useLocalStore(
    () =>
      new SearchStore({
        handleChange: (params) => rootStore.queryParamsStore.mergeQueryParams(params),
        rootStore,
      })
  );

  return searchStore;
};

export default useSearchStore;
