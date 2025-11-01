import { Collection } from "@model/collections";

const getInitialCollection = <K extends string | number, V = unknown>(): Collection<K, V> => {
  return {
    order: new Set(),
    entities: new Map(),
  };
};
export default getInitialCollection;
