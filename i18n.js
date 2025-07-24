import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ar from './locales/ar-SA.json';
import en from './locales/en-US.json';
import ru from './locales/ru-RU.json';

const resources = {
  'ar-SA': { translation: ar },
  'en-US': { translation: en },
  'ru-RU': { translation: ru },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('persist:language').then((data) => {
    if (data) {
      return JSON.parse(data).value;
    }
  });
  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: resources,
    lng: savedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
