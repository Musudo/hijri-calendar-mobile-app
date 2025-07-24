import { useSelector } from 'react-redux';
import { RootState } from '~/redux/Store';
import { Appearance, View } from 'react-native';
import { useMemo } from 'react';
import { cn } from '~/utils/cn';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: RootState) => state.theme.value);
  const system = Appearance.getColorScheme();

  const resolvedTheme = useMemo(() => {
    return theme === 'system' ? system : theme;
  }, [theme, system]);

  return <View className={cn('flex-1', resolvedTheme === 'dark' && 'dark')}>{children}</View>;
}
