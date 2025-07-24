import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/ui/Text';

export default function PlannedEventInfoModal() {
  const params = useLocalSearchParams();
  const { title, content } = params;

  return (
    <View className="flex-1 bg-[f2f2f2] pb-2 dark:bg-gray-950">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">Planned event test</Text>
        <View className="my-7 h-[1px] w-4/5 bg-gray-200" />
        <Text className="mx-4 text-xl">Test content</Text>
      </View>
    </View>
  );
}
