import RootStore, { RootStoreInitData } from "./RootStore";
import { enableStaticRendering } from 'mobx-react-lite';

const isServer = typeof window === "undefined";
enableStaticRendering(isServer);

let clientStore: RootStore;

const useCreateRootStore = (rootStoreInitData: RootStoreInitData): RootStore => {
  const initRootStore = (): RootStore => {
    return new RootStore(rootStoreInitData);
  };
  let result: RootStore;

  if (isServer) {
    result = initRootStore();
  } else {
    clientStore = clientStore ?? initRootStore();
    result = clientStore;
  }
  return result;
};

export default useCreateRootStore;