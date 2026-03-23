import { configureStore } from '@reduxjs/toolkit';
import paletteReducer from './slices/paletteSlice';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    palette: paletteReducer,
    favorites: favoritesReducer,
    auth: authReducer,
  },
});
