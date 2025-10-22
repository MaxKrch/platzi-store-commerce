export const META_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type MetaStatus = (typeof META_STATUS)[keyof typeof META_STATUS];
