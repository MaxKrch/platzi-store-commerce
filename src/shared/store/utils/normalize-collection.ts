import { Collection } from "@model/collections";

export const normalizeCollection = <K extends number | string, T>(
  elements: T[],
  getKeyForCollection: (element: T) => K
): Collection<K, T> => {
  const collection: Collection<K, T> = {
    order: [],
    entities: {} as Record<K, T>,
  };

  elements.forEach((item) => {
    const id = getKeyForCollection(item);
    collection.order.push(id);
    collection.entities[id] = item;
  });

  return collection;
};
