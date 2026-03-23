import { createSlice } from '@reduxjs/toolkit';
import chroma from 'chroma-js';

const generateRandomColor = () => ({
  hex: chroma.random().hex(),
  locked: false,
  id: Math.random().toString(36).substr(2, 9),
});

const initialState = {
  colors: Array.from({ length: 5 }, () => {
    const hex = chroma.random().hex();
    return {
      hex: hex,
      name: chroma(hex).name(),
      locked: false,
      id: Math.random().toString(36).substr(2, 9),
    };
  }),
  theoryRule: 'Random',
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
      if (state.theoryRule === 'Random') {
        state.colors = state.colors.map(color => {
          if (color.locked) return color;
          const newHex = chroma.random().hex();
          return { ...color, hex: newHex, name: chroma(newHex).name() };
        });
      } else {
        // Find first unlocked or first color to use as base
        const baseColor = state.colors.find(c => c.locked)?.hex || state.colors[0].hex;
        let palette;
        
        switch (state.theoryRule) {
          case 'Monochromatic':
            palette = chroma.scale([chroma(baseColor).darken(2), baseColor, chroma(baseColor).brighten(2)])
              .mode('lch').colors(state.colors.length);
            break;
          case 'Analogous':
            palette = Array.from({ length: state.colors.length }, (_, i) => 
              chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + (i * 20)) % 360).hex()
            );
            break;
          case 'Complementary':
            const comp = chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + 180) % 360).hex();
            palette = chroma.scale([baseColor, comp]).mode('lch').colors(state.colors.length);
            break;
          case 'Triadic':
            palette = Array.from({ length: state.colors.length }, (_, i) => 
              chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + (i * 120)) % 360).hex()
            );
            break;
          default:
            palette = state.colors.map(() => chroma.random().hex());
        }

        state.colors = state.colors.map((color, i) => 
          color.locked ? color : { ...color, hex: palette[i], name: chroma(palette[i]).name() }
        );
      }

      // Update history
      state.history = state.history.slice(0, state.pointer + 1);
      state.history.push(JSON.parse(JSON.stringify(state.colors)));
      state.pointer = state.history.length - 1;
    },
    setTheoryRule: (state, action) => {
      state.theoryRule = action.payload;
    },
    toggleLock: (state, action) => {
      const color = state.colors.find(c => c.id === action.payload);
      if (color) color.locked = !color.locked;
    },
    updateColor: (state, action) => {
      const { id, hex, name } = action.payload;
      const color = state.colors.find(c => c.id === id);
      if (color) {
        if (hex) color.hex = hex;
        if (name) color.name = name;
        else if (hex) color.name = chroma(hex).name();
      }
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
        
        let newHex = chroma.random().hex();
        
        // If inserting between two colors, create a blended color
        if (index > 0 && index < state.colors.length) {
          const colorLeft = state.colors[index - 1].hex;
          const colorRight = state.colors[index].hex;
          
          // Randomly mix the two colors (between 25% and 75% bias to either side)
          const ratio = 0.25 + Math.random() * 0.5;
          newHex = chroma.mix(colorLeft, colorRight, ratio, 'lch').hex();
        }

        state.colors.splice(index, 0, {
          hex: newHex,
          name: chroma(newHex).name(),
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
  setTheoryRule,
  toggleLock,
  updateColor,
  reorderColors,
  addColumn,
  removeColumn,
  undo,
  redo
} = paletteSlice.actions;

export default paletteSlice.reducer;
