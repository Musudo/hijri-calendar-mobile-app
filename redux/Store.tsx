import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import languageSlice from '~/redux/slice/LanguageSlice';
import themeSlice from '~/redux/slice/ThemeSlice';
import calendarSettingsSlice from '~/redux/slice/CalendarSettingsSlice';

const persistedLanguageReducer = persistReducer(
  {
    key: 'language',
    storage: AsyncStorage,
  },
  languageSlice
);

const persistedThemeReducer = persistReducer(
  {
    key: 'theme',
    storage: AsyncStorage,
  },
  themeSlice
);

const persistedCalendarSettingsReducer = persistReducer(
  {
    key: 'calendarSettings',
    storage: AsyncStorage,
  },
  calendarSettingsSlice
);

export const store = configureStore({
  reducer: {
    language: persistedLanguageReducer,
    theme: persistedThemeReducer,
    calendarSettings: persistedCalendarSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
