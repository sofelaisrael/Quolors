import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthModalOpen: false,
  isColorDetailsModalOpen: false,
  selectedColorForDetails: null, // The color object to show details for
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    openColorDetailsModal: (state, action) => {
      state.isColorDetailsModalOpen = true;
      state.selectedColorForDetails = action.payload;
    },
    closeColorDetailsModal: (state) => {
      state.isColorDetailsModalOpen = false;
      state.selectedColorForDetails = null;
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  openColorDetailsModal,
  closeColorDetailsModal
} = uiSlice.actions;

export default uiSlice.reducer;
