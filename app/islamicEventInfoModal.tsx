import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Button } from '~/components/ui/Button';
import { Divider } from '~/components/ui/Divider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ImageKey, imageMapper } from '~/utils/imageMapper';
import { Text } from '~/components/ui/Text';
import Card from '~/components/ui/Card';

export default function IslamicEventInfoModal() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let islamicEvent = undefined;
  if (params.islamicEvent) {
    if (typeof params.islamicEvent === 'string') {
      islamicEvent = JSON.parse(params.islamicEvent);
    } else {
      islamicEvent = params.islamicEvent; // Sometimes it's already parsed (rare)
    }
  }

  return (
    <View className="flex-1 bg-[f2f2f2] pb-2 dark:bg-gray-950">
      {/* Image and Date */}
      <View>
        <Image
          source={imageMapper[islamicEvent.imageUrl as ImageKey]}
          className="h-72 w-full"
          resizeMode="cover"
        />
        <Card className="absolute right-4 top-4 rounded-full border-0 bg-white/80 px-3 py-1 dark:bg-gray-900/80">
          <Text className="text-xs font-bold">{islamicEvent.dateLabel}</Text>
        </Card>
      </View>

      {/* Floating Card */}
      <View className="relative -mt-8 px-4">
        <View className="rounded-xl bg-white/90 px-4 py-3 shadow-md dark:bg-gray-900/80">
          <Text className="text-xl font-bold text-gray-900">{islamicEvent.name}</Text>
          <Text className="mt-1 text-sm italic text-gray-500">{islamicEvent.quote}</Text>
        </View>
      </View>

      {/* Spacer to offset the floating card */}
      <View className="h-6" />

      <ScrollView contentContainerClassName="p-0" showsVerticalScrollIndicator={false}>
        {/* Timeline Checklist */}
        <View className="mt-2 px-6">
          <Text className="mb-2 text-base font-semibold">Things to do:</Text>
          <View>
            {islamicEvent.todos &&
              islamicEvent.todos.map(
                (
                  item: {
                    icon: string;
                    label: string;
                  },
                  idx: number
                ) => (
                  <View key={idx} className="mb-2 flex-row items-center">
                    <Text className="mr-3 text-xl">{item.icon}</Text>
                    <Text className="text-base text-gray-700">{item.label}</Text>
                  </View>
                )
              )}
          </View>
        </View>

        <Divider className="mx-6 my-3" />

        {/* Facts Carousel */}
        <View className="mb-2">
          <Text className="mb-2 px-6 text-base font-semibold text-gray-800">Did you know?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-2">
            {islamicEvent.facts &&
              islamicEvent.facts.map((fact: string, idx: number) => (
                <Card key={idx} className="mr-3 w-64 rounded-xl bg-blue-50 px-4 py-3 shadow">
                  <Text className="text-sm">{fact}</Text>
                </Card>
              ))}
          </ScrollView>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-center gap-x-3 px-6">
          <Button
            title="Close"
            variant="primary"
            className="flex-1"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </View>
  );
}
