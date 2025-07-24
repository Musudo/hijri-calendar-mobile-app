import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SplashScreen, Stack } from 'expo-router';
import { RootState } from '~/redux/Store';
import { useTranslation } from 'react-i18next';
import { colorScheme } from 'nativewind';
import 'moment/locale/ar';
import 'moment/locale/ru';
import moment from 'moment-hijri';
import { hijriMonthsArabic } from '~/constants/calendarConstants';
import * as Font from 'expo-font';
import { useFontFamily } from '~/providers/FontProvider';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import * as SystemUI from 'expo-system-ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayoutInner() {
  const language = useSelector((state: RootState) => state.language.value);
  const theme = useSelector((state: RootState) => state.theme.value);
  const systemTheme = Appearance.getColorScheme();
  const resolvedTheme = (theme === 'system' ? systemTheme : theme) ?? 'light';
  const fontFamily = useFontFamily();
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Load here assets, fonts, Redux stuff, etc.

        await Font.loadAsync({
          Amiri: require('../assets/fonts/Amiri/Amiri-Regular.ttf'),
          Rubik: require('../assets/fonts/Rubik/Rubik-VariableFont_wght.ttf'),
          Montserrat: require('../assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf'),
          Merriweather_Sans: require('../assets/fonts/Merriweather_Sans/MerriweatherSans-VariableFont_wght.ttf'),
          Roboto: require('../assets/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf'),
        });

        i18n.changeLanguage(language);

        let momentLocale = 'en';
        if (language === 'ar-SA') {
          momentLocale = 'ar';

          moment.updateLocale('ar', {
            iMonths: hijriMonthsArabic,
            iMonthsShort: hijriMonthsArabic,
          });
        } else if (language === 'ru-RU') {
          momentLocale = 'ru';
        } else if (language === 'en-US') {
          momentLocale = 'en-gb';
        }
        moment.locale(momentLocale);

        colorScheme.set(resolvedTheme);
        Promise.resolve(
          SystemUI.setBackgroundColorAsync(resolvedTheme === 'dark' ? '#111827' : '#ffffff')
        ).finally(() => {});
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, [i18n, language, resolvedTheme, theme]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontFamily: fontFamily,
          },
          headerBackTitleStyle: {
            fontFamily: fontFamily,
          },
          headerTintColor: theme === 'dark' ? '#9ca3af' : '#374151',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="islamicEventInfoModal"
          options={{
            presentation: 'modal',
            title: 'Islamic event info',
            headerShown: true,
            headerStyle: { backgroundColor: theme === 'dark' ? '#111827' : '#fff' },
            headerTitleStyle: { color: theme === 'dark' ? '#9ca3af' : '#374151' },
          }}
        />
        <Stack.Screen
          name="plannedEventInfoModal"
          options={{
            presentation: 'modal',
            title: 'Planned event info',
            headerShown: true,
            headerStyle: { backgroundColor: theme === 'dark' ? '#111827' : '#fff' },
            headerTitleStyle: { color: theme === 'dark' ? '#9ca3af' : '#374151' },
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
