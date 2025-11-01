export type UserApi = {
    id: number,
    email: string,
    password: string,
    name: string,
    role: 'customer' | 'admin',
    avatar: string,
}

export type User = {
    id: number,
    email: string,
    name: string,
    role: 'customer' | 'admin',
    avatar: string
}
