export type Collection<K extends string | number, T> = {
  order: K[];
  entities: Record<K, T>;
};
