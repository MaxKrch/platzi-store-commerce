import { Collection } from "@model/collections";

export const linearizeCollection = <K extends string | number, T>(
  elements: Collection<K, T> | null | undefined
): T[] => {
  if (!elements?.order) {
    return [];
  }

  const linearized = [...elements.order]
    .map((id) => elements.entities.get(id))
    .filter((item): item is T => item !== undefined);
    
  return linearized;
};
