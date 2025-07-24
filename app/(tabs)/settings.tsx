import { Container } from '~/components/ui/Container';
import { Cardtest } from '~/components/ui/Cardtest';
import { TouchableOpacity, View } from 'react-native';
import { Divider } from '~/components/ui/Divider';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/Store';
import { ETranslation, setLanguage } from '~/redux/slice/LanguageSlice';
import { setTheme, ThemeType } from '~/redux/slice/ThemeSlice';
import { toggleSetting } from '~/redux/slice/CalendarSettingsSlice';
import { Text } from '~/components/ui/Text';
import Card from '~/components/ui/Card';

const themes = [
  { label: 'system', icon: 'smartphone' },
  { label: 'light', icon: 'sun' },
  { label: 'dark', icon: 'moon' },
] as const;

const languages = [
  { label: 'arabic', code: 'ar-SA' },
  { label: 'english', code: 'en-US' },
  { label: 'russian', code: 'ru-RU' },
] as const;

const calendarSettings = [
  { label: 'Fully Arabic calendar', key: 'arabicCalendar', icon: 'calendar' },
  { label: 'Show full weekdays in Arabic', key: 'fullArabicWeekdays', icon: 'feather' },
] as const;

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.value);
  const { t } = useTranslation(undefined, {
    // this will trigger re-render on language change
    useSuspense: false,
  });
  const theme = useSelector((state: RootState) => state.theme.value);
  const calendarSettingsState = useSelector((state: RootState) => state.calendarSettings);

  return (
    <Container>
      <Text className="mb-2 mt-2 text-lg font-bold">{t('settings.theme')}</Text>
      <Card className="p-4 overflow-hidden" >
        {themes.map((thm, index) => (
          <View key={thm.label}>
            <TouchableOpacity
              onPress={() => dispatch(setTheme(thm.label as ThemeType))}
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center space-x-3">
                <Feather
                  name={thm.icon}
                  size={18}
                  color={theme === 'dark' ? '#9ca3af' : '#374151'}
                />
                <Text className="ml-2 text-base">{t(`settings.${thm.label}`)}</Text>
              </View>
              <View
                className={`h-6 w-6 items-center justify-center rounded-full border-[1px] ${
                  theme === thm.label ? 'border-gray-700 dark:border-gray-400' : 'border-gray-400'
                }`}>
                {theme === thm.label && (
                  <View className="h-[13px] w-[13px] rounded-full bg-gray-700 dark:bg-gray-400" />
                )}
              </View>
            </TouchableOpacity>

            {index < themes.length - 1 && <Divider className="my-2" />}
          </View>
        ))}
      </Card>

      <Text className="mb-2 mt-8 text-lg font-bold">{t('settings.language')}</Text>
      <Card className="p-4 overflow-hidden" simple>
        {languages.map((lang, index) => (
          <View key={lang.code}>
            <TouchableOpacity
              onPress={() => dispatch(setLanguage(lang.code as ETranslation))}
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center space-x-3">
                <Text className="text-base">{t(`settings.${lang.label}`)}</Text>
              </View>
              <View
                className={`h-6 w-6 items-center justify-center rounded-full border-[1px] ${
                  language === lang.code
                    ? 'border-gray-700 dark:border-gray-400'
                    : 'border-gray-400'
                }`}>
                {language === lang.code && (
                  <View className="h-[13px] w-[13px] rounded-full bg-gray-700 dark:bg-gray-400" />
                )}
              </View>
            </TouchableOpacity>

            {index < languages.length - 1 && <Divider className="my-2" />}
          </View>
        ))}
      </Card>

      <Text className="mb-2 mt-8 text-lg font-bold">{t('settings.calendar')}</Text>
      <Card className="p-4 overflow-hidden" simple>
        {calendarSettings.map((setting, index) => (
          <View key={setting.key}>
            <TouchableOpacity
              onPress={() => dispatch(toggleSetting(setting.key))}
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center space-x-3">
                <Feather
                  name={setting.icon}
                  size={18}
                  color={theme === 'dark' ? '#9ca3af' : '#374151'}
                />
                <Text className="ml-2 text-base">{t(`settings.${setting.key}`)}</Text>
              </View>
              {calendarSettingsState[setting.key] && (
                <Feather name="check" size={20} color={theme === 'dark' ? '#9ca3af' : '#374151'} />
              )}
            </TouchableOpacity>

            {index < calendarSettings.length - 1 && <Divider className="my-2" />}
          </View>
        ))}
      </Card>
    </Container>
  );
}
