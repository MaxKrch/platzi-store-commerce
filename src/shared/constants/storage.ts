export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token',
} as const;

export type StorageKeys = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]