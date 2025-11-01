export type TokensResponse = {
  access_token: string,
  refresh_token: string,
}

export type AuthData = {
  email: string,
  password: string,
  keepMeLoggedIn: boolean
}

export type RefreshTokensData = {
  keepMeLoggedIn: boolean
}

export type AuthResponse = 
  | { success: true, token: string }
  | { success: false, error: string }

export type LogoutResponse = 
  | { success: true }
  | { success: false, error: string }


