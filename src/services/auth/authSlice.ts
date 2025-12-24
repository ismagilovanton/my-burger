import { apiAuth } from '@/api/apiAuth';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type {
  TLoginRequest,
  TRegisterRequest,
  TUpdateUserRequest,
  TUser,
} from '@/types/auth';
import type { PayloadAction } from '@reduxjs/toolkit';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  status: 'idle',
  error: null,
};

const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const saveTokens = (accessToken: string, refreshToken: string): void => {
  setCookie(ACCESS_TOKEN_COOKIE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearTokens = (): void => {
  deleteCookie(ACCESS_TOKEN_COOKIE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const registerUser = createAsyncThunk<TUser, TRegisterRequest>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiAuth.register(payload);
      saveTokens(data.accessToken, data.refreshToken);
      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginRequest>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiAuth.login(payload);
      saveTokens(data.accessToken, data.refreshToken);
      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        clearTokens();
        return;
      }

      await apiAuth.logout({ token: refreshToken });
      clearTokens();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const refreshToken = createAsyncThunk<void>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshTokenValue) {
        clearTokens();
        throw new Error('No refresh token');
      }

      const data = await apiAuth.refreshToken({ token: refreshTokenValue });

      saveTokens(data.accessToken, data.refreshToken);
    } catch (error) {
      clearTokens();
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const fetchUser = createAsyncThunk<TUser>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiAuth.getUser();
      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<TUser, TUpdateUserRequest>(
  'auth/updateUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiAuth.updateUser(payload);
      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
      state.isAuthChecked = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to register';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to login';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'succeeded';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to logout';
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to refresh token';
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to get user';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'Failed to update user';
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
