export type TUser = {
  email: string;
  name: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type TUpdateUserRequest = {
  email: string;
  name: string;
  password?: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TTokenRequest = {
  token: string;
};

export type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};
