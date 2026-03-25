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
  theoryRule: 'Random', // Default rule
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
        case 'Split-Complementary':
          newHexes = Array.from({ length: count }, (_, i) => {
            const baseHue = baseColor.get('hsl.h');
            if (i === 0) return baseColor.hex();
            if (i === 1) return baseColor.set('hsl.h', (baseHue + 150) % 360).hex();
            if (i === 2) return baseColor.set('hsl.h', (baseHue + 210) % 360).hex();
            return baseColor.set('hsl.h', (baseHue + (i * 30)) % 360).hex();
          });
          break;
        case 'Random':
          newHexes = Array.from({ length: count }, () => chroma.random().hex());
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
        let newColor;
        
        // Generate intermediate color between adjacent colors
        if (index > 0 && index < state.colors.length) {
          const leftColor = state.colors[index - 1];
          const rightColor = state.colors[index];
          // Create color that's exactly between the two adjacent colors
          newColor = chroma.mix(leftColor.hex, rightColor.hex, 0.5).hex();
        } else if (index === 0) {
          // If adding at the beginning, use the first color as reference
          newColor = chroma(state.colors[0].hex).set('hsl.l', '+10%').hex();
        } else {
          // If adding at the end, use the last color as reference
          newColor = chroma(state.colors[state.colors.length - 1].hex).set('hsl.l', '+10%').hex();
        }
        
        state.colors.splice(index, 0, {
          hex: newColor,
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
