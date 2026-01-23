import type { AppActions, AppDispatch, RootState } from '@/types';
import type { Middleware, MiddlewareAPI } from 'redux';

export const socketMiddleware = (wsUrl: string): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: AppActions) => {
      const { dispatch } = store;
      const { type, payload } = action as { type: string; payload?: unknown };

      if (type === 'WS_CONNECTION_START' && !socket) {
        // создаём подключение к WebSocket только если его ещё нет
        socket = new WebSocket(wsUrl);
      }

      if (socket) {
        // соединение установлено
        socket.onopen = (event: Event): void => {
          dispatch({ type: 'WS_CONNECTION_SUCCESS', payload: event });
        };

        // ошибка соединения
        socket.onerror = (event: Event): void => {
          dispatch({ type: 'WS_CONNECTION_ERROR', payload: event });
        };

        // получение сообщения
        socket.onmessage = (event: MessageEvent<string>): void => {
          const { data } = event;
          dispatch({ type: 'WS_GET_MESSAGE', payload: data });
        };

        // закрытие соединения (со стороны сервера или из браузера)
        socket.onclose = (event: CloseEvent): void => {
          dispatch({ type: 'WS_CONNECTION_CLOSED', payload: event });
          socket = null;
        };

        // отправка сообщения на сервер по экшену
        if (type === 'WS_SEND_MESSAGE' && payload) {
          const message = payload as unknown;
          socket.send(JSON.stringify(message));
        }
      }

      return next(action);
    };
  }) as Middleware;
};
