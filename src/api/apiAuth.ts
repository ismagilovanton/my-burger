import { API_URL } from '@/constants/api';
import { handleResponse } from '@/helpers/apiErrorHandler';
import { getCookie } from '@/utils/cookie';

import type {
  TAuthResponse,
  TLoginRequest,
  TLogoutResponse,
  TRegisterRequest,
  TTokenRequest,
  TTokenResponse,
  TUpdateUserRequest,
  TUserResponse,
} from '@/types/auth';

const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';

const getAccessTokenFromCookie = (): string => {
  const token = getCookie(ACCESS_TOKEN_COOKIE_KEY);

  if (!token) {
    throw new Error('No access token');
  }

  return token;
};

type TForgotPasswordRequest = {
  email: string;
};

type TForgotPasswordResponse = {
  success: boolean;
  message: string;
};

type TResetPasswordRequest = {
  password: string;
  token: string;
};

type TResetPasswordResponse = {
  success: boolean;
  message: string;
};

export const apiAuth = {
  forgotPassword: async (
    payload: TForgotPasswordRequest
  ): Promise<TForgotPasswordResponse> => {
    const response = await fetch(`${API_URL}/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TForgotPasswordResponse>(
      response,
      'Failed to send password reset email'
    );
  },

  resetPassword: async (
    payload: TResetPasswordRequest
  ): Promise<TResetPasswordResponse> => {
    const response = await fetch(`${API_URL}/password-reset/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TResetPasswordResponse>(response, 'Failed to reset password');
  },

  register: async (payload: TRegisterRequest): Promise<TAuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TAuthResponse>(response, 'Failed to register user');
  },

  login: async (payload: TLoginRequest): Promise<TAuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TAuthResponse>(response, 'Failed to login');
  },

  refreshToken: async (payload: TTokenRequest): Promise<TTokenResponse> => {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TTokenResponse>(response, 'Failed to refresh token');
  },

  logout: async (payload: TTokenRequest): Promise<TLogoutResponse> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TLogoutResponse>(response, 'Failed to logout');
  },

  getUser: async (): Promise<TUserResponse> => {
    const accessToken = getAccessTokenFromCookie();

    const response = await fetch(`${API_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });

    return handleResponse<TUserResponse>(response, 'Failed to get user');
  },

  updateUser: async (payload: TUpdateUserRequest): Promise<TUserResponse> => {
    const accessToken = getAccessTokenFromCookie();

    const response = await fetch(`${API_URL}/auth/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<TUserResponse>(response, 'Failed to update user');
  },
};
