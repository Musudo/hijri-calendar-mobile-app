import { Tabs } from 'expo-router';
import { TabBarIcon } from '~/components/ui/TabBarIcon';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/Store';
import { Appearance } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '~/providers/FontProvider';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

export default function TabLayout() {
  const theme = useSelector((state: RootState) => state.theme.value);
  const systemTheme = Appearance.getColorScheme();
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const fontFamily = useFontFamily();
  const { t } = useTranslation(undefined, {
    // this will trigger re-render on language change
    useSuspense: false,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme === 'dark' ? '#ffffff' : '#ffffff');
  }, [theme]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#ffffff', // bg-gray-900 or white
          borderTopColor: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb', // gray-700 or gray-200
        },
        tabBarActiveTintColor: resolvedTheme === 'dark' ? '#ffffff' : '#111827',
        tabBarInactiveTintColor: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280', // gray-400 or gray-500
        tabBarLabelStyle: { fontFamily: fontFamily },
        headerStyle: {
          backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#ffffff',
        },
        headerTitleStyle: {
          color: resolvedTheme === 'dark' ? '#ffffff' : '#111827',
          fontFamily: fontFamily
        },
        // headerTintColor: theme === 'dark' ? 'red' : 'red',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ color }) => <TabBarIcon name={'home'} color={color} />,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <HeaderButton />
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('calendar.title'),
          tabBarIcon: ({ color }) => <TabBarIcon name={'calendar'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color }) => <TabBarIcon name={'settings'} color={color} />,
        }}
      />
    </Tabs>
  );
}
