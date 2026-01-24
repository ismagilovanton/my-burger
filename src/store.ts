import { configureStore } from '@reduxjs/toolkit';

import { FEED_WS_ACTIONS, PROFILE_WS_ACTIONS } from './constants/ws';
import { rootReducer } from './root-reducer';
import { socketMiddleware } from './services/socketMiddleware';

const feedWsMiddleware = socketMiddleware(
  'wss://norma.education-services.ru/orders/all',
  {
    wsInitType: FEED_WS_ACTIONS.INIT,
    wsCloseType: FEED_WS_ACTIONS.CLOSE,
    wsSendType: FEED_WS_ACTIONS.SEND,
    onOpenType: FEED_WS_ACTIONS.OPEN,
    onCloseType: FEED_WS_ACTIONS.CLOSED,
    onErrorType: FEED_WS_ACTIONS.ERROR,
    onMessageType: FEED_WS_ACTIONS.MESSAGE,
  }
);

const profileOrdersWsMiddleware = socketMiddleware(
  'wss://norma.education-services.ru/orders',
  {
    wsInitType: PROFILE_WS_ACTIONS.INIT,
    wsCloseType: PROFILE_WS_ACTIONS.CLOSE,
    wsSendType: PROFILE_WS_ACTIONS.SEND,
    onOpenType: PROFILE_WS_ACTIONS.OPEN,
    onCloseType: PROFILE_WS_ACTIONS.CLOSED,
    onErrorType: PROFILE_WS_ACTIONS.ERROR,
    onMessageType: PROFILE_WS_ACTIONS.MESSAGE,
    withAuth: true,
  }
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedWsMiddleware, profileOrdersWsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
