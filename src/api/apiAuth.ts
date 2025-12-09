import { API_URL } from '@/constants/api';
import { handleResponse } from '@/helpers/apiErrorHandler';

import type {
  TAuthResponse,
  TLoginRequest,
  TLogoutResponse,
  TRegisterRequest,
  TTokenRequest,
  TTokenResponse,
} from '@/types/auth';

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
};
