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
          let newHex;
          let attempts = 0;
          do {
            newHex = chroma.random().hex();
            attempts++;
          } while (attempts < 10 && state.colors.some((c, i) => 
            !c.locked && c.hex === newHex && state.colors.indexOf(c) < state.colors.indexOf(color)
          ));
          return { ...color, hex: newHex, name: chroma(newHex).name() };
        });
      } else {
        // For non-random modes, use a new random base color each time for variety
        let baseColor;
        const lockedColor = state.colors.find(c => c.locked);
        
        if (lockedColor) {
          baseColor = lockedColor.hex;
        } else {
          // Generate a new random base color for variety
          baseColor = chroma.random().hex();
        }
        
        let palette;
        
        switch (state.theoryRule) {
          case 'Monochromatic':
            // Generate more varied monochromatic colors
            palette = Array.from({ length: state.colors.length }, (_, i) => {
              const factor = (i + 1) / (state.colors.length + 1);
              const lightness = 0.2 + (factor * 0.6); // Range from 20% to 80% lightness
              return chroma(baseColor).set('lch.l', lightness * 100).hex();
            });
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
          default:
            palette = state.colors.map(() => chroma.random().hex());
        }

        // Ensure no duplicates and respect locked colors
        state.colors = state.colors.map((color, i) => {
          if (color.locked) return color;
          
          let newColor = palette[i] || chroma.random().hex();
          let attempts = 0;
          
          // Check for duplicates with ANY other color (not just previous)
          while (attempts < 20) {
            const hasDuplicate = state.colors.some((c, j) => 
              j !== i && !c.locked && c.hex === newColor
            );
            
            if (!hasDuplicate) break;
            
            // Generate a variation based on the color theory mode
            if (state.theoryRule === 'Monochromatic') {
              const factor = (i + 1 + attempts * 0.1) / (state.colors.length + 1);
              const lightness = 0.2 + (factor * 0.6);
              newColor = chroma(baseColor).set('lch.l', lightness * 100).hex();
            } else if (state.theoryRule === 'Triadic') {
              // For triadic, shift slightly within the same hue family
              const hueShift = attempts * 5; // Small hue shifts
              const baseHue = chroma(baseColor).get('hsl.h');
              const triadicIndex = i % 3;
              const targetHue = (baseHue + (triadicIndex * 120) + hueShift) % 360;
              newColor = chroma(baseColor).set('hsl.h', targetHue).hex();
            } else {
              newColor = chroma.random().hex();
            }
            attempts++;
          }
          
          return { ...color, hex: newColor, name: chroma(newColor).name() };
        });
      }

      // Update history
      state.history = state.history.slice(0, state.pointer + 1);
      state.history.push(JSON.parse(JSON.stringify(state.colors)));
      state.pointer = state.history.length - 1;
    },
    setTheoryRule: (state, action) => {
      state.theoryRule = action.payload;
      
      // Auto-adjust column count for triadic mode
      if (action.payload === 'Triadic' && state.colors.length > 3) {
        // Keep only first 3 columns (or first 3 unlocked columns)
        const lockedColors = state.colors.filter(c => c.locked);
        const unlockedColors = state.colors.filter(c => !c.locked);
        
        let newColors = [];
        
        // Keep all locked colors
        newColors.push(...lockedColors);
        
        // Add unlocked colors up to 3 total
        const remainingSlots = 3 - lockedColors.length;
        if (remainingSlots > 0) {
          newColors.push(...unlockedColors.slice(0, remainingSlots));
        }
        
        // If we have less than 3 colors, add more
        while (newColors.length < 3) {
          newColors.push({
            hex: chroma.random().hex(),
            name: chroma(chroma.random().hex()).name(),
            locked: false,
            id: Math.random().toString(36).substr(2, 9),
          });
        }
        
        state.colors = newColors;
        
        // Push to history
        state.history = state.history.slice(0, state.pointer + 1);
        state.history.push(JSON.parse(JSON.stringify(state.colors)));
        state.pointer = state.history.length - 1;
      }
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
      // Define column limits for different color theory modes
      const maxColumns = {
        'Random': 10,
        'Monochromatic': 10,
        'Analogous': 10,
        'Complementary': 10,
        'Triadic': 3 // Triadic should ideally have exactly 3 colors
      };
      
      const currentMax = maxColumns[state.theoryRule] || 10;
      
      if (state.colors.length < currentMax) {
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
