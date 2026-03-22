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
};

const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {
    setPalette: (state, action) => {
      state.colors = action.payload;
      // Only push to history if it's different from the current pointer
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
    generatePalette: (state) => {
      state.colors = state.colors.map(color =>
        color.locked ? color : { ...color, hex: chroma.random().hex() }
      );
      // Update history
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
      // Also push reorder to history
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
        // Push to history
        state.history = state.history.slice(0, state.pointer + 1);
        state.history.push(JSON.parse(JSON.stringify(state.colors)));
        state.pointer = state.history.length - 1;
      }
    },
    removeColumn: (state, action) => {
      if (state.colors.length > 2) {
        state.colors = state.colors.filter(c => c.id !== action.payload);
        // Push to history
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
