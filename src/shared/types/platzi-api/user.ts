import { UserApi } from "@model/user";

export type RegisterUserData = {
  name: string,
  email: string,
  password: string,
  avatar?: string,
  keepMeLoggedIn: boolean,
}
export type RegisterUserResponse = UserApi;

export type UpdateUserData = Pick<RegisterUserData, 'email' | 'name'>;
export type UpdateUserResponse = UserApi;

export type CheckAvailableEmailData = Pick<RegisterUserData, 'email'>;
export type CheckAvailableEmailResponse = {
  isAvailable: boolean
}
