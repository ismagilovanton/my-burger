import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './root-reducer';
import { socketMiddleware } from './services/socketMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware('wss://norma.education-services.ru/orders/all')
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
