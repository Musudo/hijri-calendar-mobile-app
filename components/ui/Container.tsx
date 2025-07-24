import { SafeAreaView, ScrollView } from 'react-native';
import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
};

export const Container = ({
  children,
  className = '',
  contentContainerClassName = '',
}: ContainerProps) => {
  return (
    <SafeAreaView className={`flex-1 bg-[f2f2f2] dark:bg-gray-950 ${className}`}>
      <ScrollView
        contentContainerClassName={`p-4 ${contentContainerClassName}`}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
