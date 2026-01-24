import { PROFILE_WS_ACTIONS } from '@/constants/ws';
import { createSlice } from '@reduxjs/toolkit';

import type { AppActions } from '@/types';
import type { TOrder, TOrdersResponse } from '@/types/order';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'connecting' | 'online' | 'offline' | 'error';
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: AppActions): action is PayloadAction<Event> =>
          action.type === PROFILE_WS_ACTIONS.INIT,
        (state) => {
          state.status = 'connecting';
          state.error = null;
        }
      )
      .addMatcher(
        (action: AppActions): action is PayloadAction<Event> =>
          action.type === PROFILE_WS_ACTIONS.OPEN,
        (state) => {
          state.status = 'online';
          state.error = null;
        }
      )
      .addMatcher(
        (action: AppActions): action is PayloadAction<ErrorEvent> =>
          action.type === PROFILE_WS_ACTIONS.ERROR,
        (state, action) => {
          state.status = 'error';
          const payload = action.payload;
          state.error =
            typeof payload === 'string' ? payload : 'WebSocket connection error';
        }
      )
      .addMatcher(
        (action: AppActions): action is PayloadAction<CloseEvent> =>
          action.type === PROFILE_WS_ACTIONS.CLOSED,
        (state) => {
          state.status = 'offline';
        }
      )
      .addMatcher(
        (action: AppActions): action is PayloadAction<string> =>
          action.type === PROFILE_WS_ACTIONS.MESSAGE,
        (state, action) => {
          try {
            const data = JSON.parse(action.payload) as TOrdersResponse;
            if (!data.success) {
              state.status = 'error';
              state.error = 'WebSocket response error';
              return;
            }
            state.orders = data.orders;
            state.total = data.total;
            state.totalToday = data.totalToday;
            state.status = 'online';
            state.error = null;
          } catch (error) {
            state.status = 'error';
            state.error =
              error instanceof Error ? error.message : 'Invalid WebSocket payload';
          }
        }
      );
  },
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
