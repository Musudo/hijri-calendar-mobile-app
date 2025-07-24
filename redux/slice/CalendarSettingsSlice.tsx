import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CalendarSettingsSliceType = {
  arabicCalendar: boolean;
  fullArabicWeekdays: boolean;
  moonPhases: boolean;
};

const initialState: CalendarSettingsSliceType = {
  arabicCalendar: false,
  fullArabicWeekdays: false,
  moonPhases: true,
};

const calendarSettingsSlice = createSlice({
  name: 'calendarSettings',
  initialState,
  reducers: {
    toggleSetting: (state, action: PayloadAction<keyof CalendarSettingsSliceType>) => {
      const key = action.payload;
      state[key] = !state[key];
    },
    setSetting: (
      state,
      action: PayloadAction<{ key: keyof CalendarSettingsSliceType; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setAllSettings: (state, action: PayloadAction<CalendarSettingsSliceType>) => {
      return action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const { toggleSetting, setSetting, setAllSettings, resetSettings } = calendarSettingsSlice.actions;
export default calendarSettingsSlice.reducer;
