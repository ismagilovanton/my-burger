import type { rootReducer } from '@/root-reducer';
import type { ThunkDispatch } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';

export type RootState = ReturnType<typeof rootReducer>;

// Обобщённый тип всех экшенов приложения.
// Для упрощения сейчас используем AnyAction, при необходимости можно сузить.
export type AppActions = AnyAction;

export type AppDispatch = ThunkDispatch<RootState, unknown, AppActions>;
