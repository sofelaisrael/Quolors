import { configureStore } from '@reduxjs/toolkit';
import paletteReducer from './slices/paletteSlice';
import favoritesReducer from './slices/favoritesSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    palette: paletteReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
    notification: notificationReducer,
  },
});
