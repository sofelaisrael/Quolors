import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: []
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { id, message, type = 'info', duration = 3000 } = action.payload;
      state.notifications.push({
        id: id || Date.now(),
        message,
        type,
        duration,
        timestamp: Date.now()
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  addNotification,
  removeNotification,
  clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;
