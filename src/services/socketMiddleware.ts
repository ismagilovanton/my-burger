import { getCookie } from '@/utils/cookie';

import type { AppActions, AppDispatch, RootState } from '@/types';
import type { Middleware, MiddlewareAPI } from 'redux';

type TSocketMiddlewareOptions = {
  wsInitType: string;
  wsCloseType: string;
  wsSendType: string;
  onOpenType: string;
  onCloseType: string;
  onErrorType: string;
  onMessageType: string;
  withAuth?: boolean;
};

export const socketMiddleware = (
  wsUrl: string,
  options?: Partial<TSocketMiddlewareOptions>
): Middleware => {
  const {
    wsInitType = 'WS_CONNECTION_START',
    wsCloseType = 'WS_CONNECTION_CLOSE',
    wsSendType = 'WS_SEND_MESSAGE',
    onOpenType = 'WS_CONNECTION_SUCCESS',
    onCloseType = 'WS_CONNECTION_CLOSED',
    onErrorType = 'WS_CONNECTION_ERROR',
    onMessageType = 'WS_GET_MESSAGE',
    withAuth = false,
  } = options ?? {};

  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: AppActions) => {
      const { dispatch } = store;
      const { type, payload } = action as { type: string; payload?: unknown };

      if (type === wsInitType) {
        if (socket) {
          socket.close();
        }

        let url = wsUrl;

        if (withAuth) {
          const accessToken = getCookie('accessToken');

          if (!accessToken) {
            return next(action);
          }

          const token = accessToken.startsWith('Bearer ')
            ? accessToken.slice(7)
            : accessToken;

          url = `${wsUrl}?token=${token}`;
        }

        socket = new WebSocket(url);
      }

      if (type === wsCloseType && socket) {
        socket.close();
      }

      if (socket) {
        socket.onopen = (event: Event): void => {
          dispatch({ type: onOpenType, payload: event });
        };

        socket.onerror = (event: Event): void => {
          dispatch({ type: onErrorType, payload: event });
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          const { data } = event;
          dispatch({ type: onMessageType, payload: data });
        };

        socket.onclose = (event: CloseEvent): void => {
          dispatch({ type: onCloseType, payload: event });
          socket = null;
        };

        if (type === wsSendType && payload) {
          const message = payload as unknown;
          socket.send(JSON.stringify(message));
        }
      }

      return next(action);
    };
  }) as Middleware;
};
