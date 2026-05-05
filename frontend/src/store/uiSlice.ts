import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  currentUserId: string;
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  successMessage: null,
  currentUserId: 'user123', // Default user ID
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    setCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const { setLoading, setError, setSuccessMessage, setCurrentUserId, clearMessages } = uiSlice.actions;
export default uiSlice.reducer;
