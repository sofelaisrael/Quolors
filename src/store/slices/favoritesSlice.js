import { createSlice } from '@reduxjs/toolkit';

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('quolors_favorites');
    return saved ? JSON.parse(saved) : { palettes: [], collections: [] };
  } catch {
    return { palettes: [], collections: [] };
  }
};

const initialState = loadFavorites();

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
          date: new Date().toISOString(),
          collectionId: null
        });
      }
      localStorage.setItem('quolors_favorites', JSON.stringify(state));
    },
    removeFavorite: (state, action) => {
      state.palettes = state.palettes.filter(p => p.id !== action.payload);
      localStorage.setItem('quolors_favorites', JSON.stringify(state));
    },
    createCollection: (state, action) => {
      state.collections.push({
        id: Math.random().toString(36).substr(2, 9),
        name: action.payload,
        date: new Date().toISOString()
      });
      localStorage.setItem('quolors_favorites', JSON.stringify(state));
    },
    deleteCollection: (state, action) => {
        state.collections = state.collections.filter(c => c.id !== action.payload);
        // Reset collectionId for palettes in this collection
        state.palettes.forEach(p => {
            if (p.collectionId === action.payload) p.collectionId = null;
        });
        localStorage.setItem('quolors_favorites', JSON.stringify(state));
    },
    movePaletteToCollection: (state, action) => {
        const { paletteId, collectionId } = action.payload;
        const palette = state.palettes.find(p => p.id === paletteId);
        if (palette) palette.collectionId = collectionId;
        localStorage.setItem('quolors_favorites', JSON.stringify(state));
    }
  },
});

export const {
    toggleFavorite,
    removeFavorite,
    createCollection,
    deleteCollection,
    movePaletteToCollection
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
