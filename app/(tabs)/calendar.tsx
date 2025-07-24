import { View } from 'react-native';
import HijriCalendar from '~/components/HijriCalendar';

export default function CalendarScreen() {
  return (
    <View className="flex-1 bg-[f2f2f2] dark:bg-gray-950">
      <HijriCalendar />
    </View>
  );
}
