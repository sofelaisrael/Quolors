import { createSlice } from '@reduxjs/toolkit';

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('quolors_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  palettes: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const palette = action.payload; // array of colors
      const paletteId = palette.map(c => c.hex).join('-');
      const index = state.palettes.findIndex(p => p.id === paletteId);

      if (index >= 0) {
        state.palettes.splice(index, 1);
      } else {
        state.palettes.push({
          id: paletteId,
          colors: palette,
          date: new Date().toISOString()
        });
      }
      localStorage.setItem('quolors_favorites', JSON.stringify(state.palettes));
    },
    removeFavorite: (state, action) => {
      state.palettes = state.palettes.filter(p => p.id !== action.payload);
      localStorage.setItem('quolors_favorites', JSON.stringify(state.palettes));
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
