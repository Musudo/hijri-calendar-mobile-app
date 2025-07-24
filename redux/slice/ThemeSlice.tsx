import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeType = 'system' | 'light' | 'dark';

interface ThemeState {
  value: ThemeType;
}

const initialState: ThemeState = {
  value: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.value = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
