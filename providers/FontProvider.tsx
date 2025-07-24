import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { Platform } from 'react-native';

type FontProviderProps = {
  language: string; // e.g., 'ar-SA', 'en-US', 'ru-RU', etc.
  children: ReactNode;
};

// Helper to pick the font based on a platform and language
const getFontFamily = (language: string) => {
  if (language.startsWith('ar')) {
    return Platform.OS === 'ios' || Platform.OS === 'android'
      ? 'Rubik'
      : 'Amiri';
  }
  if (language.startsWith('ru')) {
    return Platform.OS === 'ios' || Platform.OS === 'android'
      ? 'Merriweather_Sans'
      : 'Merriweather_Sans';
  }
  // Default (English)
  return Platform.OS === 'ios'
    ? 'Montserrat'
    : Platform.OS === 'android'
      ? 'Roboto'
      : 'Montserrat';
};

const FontFamilyContext = createContext<string>('Montserrat');

export const FontProvider = ({ language, children }: FontProviderProps) => {
  // Memoize to prevent unnecessary re-renders
  const fontFamily = useMemo(() => getFontFamily(language), [language]);

  return (
    <FontFamilyContext.Provider value={fontFamily}>
      {children}
    </FontFamilyContext.Provider>
  );
};

export const useFontFamily = () => useContext(FontFamilyContext);
