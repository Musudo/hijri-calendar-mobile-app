import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ETranslation {
  AR = 'ar-SA',
  EN = 'en-US',
  RU = 'ru-RU',
}

export interface LanguageState {
  value: ETranslation;
}

const initialState: LanguageState = {
  value: ETranslation.EN,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<ETranslation>) => {
      state.value = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
