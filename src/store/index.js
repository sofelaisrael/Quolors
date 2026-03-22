import { configureStore } from '@reduxjs/toolkit';
import paletteReducer from './slices/paletteSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    palette: paletteReducer,
    favorites: favoritesReducer,
  },
});
