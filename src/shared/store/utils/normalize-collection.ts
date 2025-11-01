import { Collection } from "@model/collections";

export const normalizeCollection = <K extends number | string, T>(
  elements: T[],
  getKeyForCollection: (element: T) => K
): Collection<K, T> => {
  const collection: Collection<K, T> = {
    order: new Set(),
    entities: new Map()
  };

  elements.forEach((item) => {
    const id = getKeyForCollection(item);
    collection.order.add(id);
    collection.entities.set(id, item);
  });

  return collection;
};
