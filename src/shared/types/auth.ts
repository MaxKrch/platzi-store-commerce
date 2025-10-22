export type RegisterData = {
    username: string,
    email: string,
    password: string,
}

export type AuthData = {
  identifier: string,
  password: string,
}

export type UserApi = {
    id: number,
    username: string,
    email: string,
    confirmed: boolean,
    blocked: boolean,
    createdAt: string,
    updatedAt: string,
}

export type User = {
    id: number,
    username: string,
    email: string,
    confirmed: boolean,
    blocked: boolean,
    createdAt: Date,
    updatedAt: Date,
}
