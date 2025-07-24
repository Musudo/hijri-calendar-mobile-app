import { Text, View } from 'react-native';
import { EditScreenInfo } from './EditScreenInfo';
import { AshuraModal } from '~/app/ashuraModal';

type ScreenContentProps = {
  title: string;
  content: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, content, children }: ScreenContentProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">{title}</Text>
      <View className="my-7 h-[1px] w-4/5 bg-gray-200" />
      {/*<EditScreenInfo content={content} />*/}
      {/*{children}*/}
      <Text className='mx-4 text-xl'>{content}</Text>

      {/*<AshuraModal*/}
      {/*  visible={true}*/}
      {/*  onClose={() => console.log('close')}*/}
      {/*  info={{*/}
      {/*    title: "Ashura",*/}
      {/*    dateLabel: "10 Muharram",*/}
      {/*    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Example Unsplash*/}
      {/*    quote: "A day of remembrance, reflection and peace.",*/}
      {/*    todos: [*/}
      {/*      { icon: "🕋", label: "Fast during the day" },*/}
      {/*      { icon: "🤲", label: "Pray for peace" },*/}
      {/*      { icon: "🥗", label: "Share food with others" },*/}
      {/*      { icon: "💧", label: "Give charity" },*/}
      {/*      { icon: "📖", label: "Read and reflect" },*/}
      {/*    ],*/}
      {/*    facts: [*/}
      {/*      "Ashura is the 10th day of Muharram, the first month in the Islamic calendar.",*/}
      {/*      "On this day, Prophet Moses and his people were saved from Pharaoh.",*/}
      {/*      "Fasting on Ashura is highly recommended for spiritual reflection.",*/}
      {/*    ],*/}
      {/*  }}*/}
      {/*/>*/}

    </View>
  );
};
