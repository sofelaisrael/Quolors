import { createSlice } from '@reduxjs/toolkit';
import chroma from 'chroma-js';

const generateRandomColor = () => ({
  hex: chroma.random().hex(),
  locked: false,
  id: Math.random().toString(36).substr(2, 9),
});

const initialState = {
  colors: Array.from({ length: 5 }, () => ({
    hex: chroma.random().hex(),
    locked: false,
    id: Math.random().toString(36).substr(2, 9),
  })),
  history: [],
  pointer: -1,
  theoryRule: 'Monochromatic', // Default rule
};

const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {
    setPalette: (state, action) => {
      state.colors = action.payload;
      const currentState = JSON.stringify(state.colors);
      const lastState = state.pointer >= 0 ? JSON.stringify(state.history[state.pointer]) : null;

      if (currentState !== lastState) {
          state.history = state.history.slice(0, state.pointer + 1);
          state.history.push(JSON.parse(currentState));
          state.pointer = state.history.length - 1;
          if (state.history.length > 50) {
            state.history.shift();
            state.pointer--;
          }
      }
    },
    setTheoryRule: (state, action) => {
      state.theoryRule = action.payload;
    },
    generatePalette: (state) => {
      const lockedColors = state.colors.filter(c => c.locked);
      let baseColor;

      if (lockedColors.length > 0) {
        baseColor = chroma(lockedColors[0].hex);
      } else {
        baseColor = chroma.random();
      }

      const count = state.colors.length;
      let newHexes = [];

      switch (state.theoryRule) {
        case 'Monochromatic':
          newHexes = chroma.scale([baseColor.darken(2), baseColor, baseColor.brighten(2)])
            .mode('lab').colors(count);
          break;
        case 'Analogous':
          newHexes = Array.from({ length: count }, (_, i) =>
            baseColor.set('hsl.h', (baseColor.get('hsl.h') + (i * 20)) % 360).hex()
          );
          break;
        case 'Complementary':
          newHexes = Array.from({ length: count }, (_, i) => {
            if (i < count / 2) return baseColor.darken(i * 0.5).hex();
            const comp = baseColor.set('hsl.h', (baseColor.get('hsl.h') + 180) % 360);
            return comp.brighten((i - count / 2) * 0.5).hex();
          });
          break;
        case 'Triadic':
          newHexes = Array.from({ length: count }, (_, i) =>
            baseColor.set('hsl.h', (baseColor.get('hsl.h') + (i * 120)) % 360).hex()
          );
          break;
        default:
          newHexes = Array.from({ length: count }, () => chroma.random().hex());
      }

      state.colors = state.colors.map((color, i) =>
        color.locked ? color : { ...color, hex: newHexes[i] || chroma.random().hex() }
      );

      state.history = state.history.slice(0, state.pointer + 1);
      state.history.push(JSON.parse(JSON.stringify(state.colors)));
      state.pointer = state.history.length - 1;
    },
    toggleLock: (state, action) => {
      const color = state.colors.find(c => c.id === action.payload);
      if (color) color.locked = !color.locked;
    },
    updateColor: (state, action) => {
      const { id, hex } = action.payload;
      const color = state.colors.find(c => c.id === id);
      if (color) color.hex = hex;
    },
    reorderColors: (state, action) => {
      state.colors = action.payload;
      state.history = state.history.slice(0, state.pointer + 1);
      state.history.push(JSON.parse(JSON.stringify(state.colors)));
      state.pointer = state.history.length - 1;
    },
    addColumn: (state, action) => {
      if (state.colors.length < 10) {
        const index = action.payload ?? state.colors.length;
        state.colors.splice(index, 0, {
          hex: chroma.random().hex(),
          locked: false,
          id: Math.random().toString(36).substr(2, 9),
        });
        state.history = state.history.slice(0, state.pointer + 1);
        state.history.push(JSON.parse(JSON.stringify(state.colors)));
        state.pointer = state.history.length - 1;
      }
    },
    removeColumn: (state, action) => {
      if (state.colors.length > 2) {
        state.colors = state.colors.filter(c => c.id !== action.payload);
        state.history = state.history.slice(0, state.pointer + 1);
        state.history.push(JSON.parse(JSON.stringify(state.colors)));
        state.pointer = state.history.length - 1;
      }
    },
    undo: (state) => {
      if (state.pointer > 0) {
        state.pointer--;
        state.colors = JSON.parse(JSON.stringify(state.history[state.pointer]));
      }
    },
    redo: (state) => {
      if (state.pointer < state.history.length - 1) {
        state.pointer++;
        state.colors = JSON.parse(JSON.stringify(state.history[state.pointer]));
      }
    }
  },
});

export const {
  setPalette,
  setTheoryRule,
  generatePalette,
  toggleLock,
  updateColor,
  reorderColors,
  addColumn,
  removeColumn,
  undo,
  redo
} = paletteSlice.actions;

export default paletteSlice.reducer;
