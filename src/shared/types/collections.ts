export type Collection<K extends string | number, T> = {
  order: Set<K>;
  entities: Map<K, T>;
};
