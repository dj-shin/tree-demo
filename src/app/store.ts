import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import numericTreeReducer from '../features/tree/numericTree';

export const store = configureStore({
  reducer: {
    numericTree: numericTreeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
