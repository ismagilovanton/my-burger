import { API_URL } from '@/constants/api';
import { handleResponse } from '@/helpers/apiErrorHandler';

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
};
