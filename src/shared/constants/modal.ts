export const MODES = {
    AUTH: 'auth',
    PROFILE: 'profile',
} as const;

export type Modes = typeof MODES[keyof typeof MODES];