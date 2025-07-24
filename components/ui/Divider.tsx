import React from 'react';
import { View, useColorScheme } from 'react-native';
import { cn } from '~/utils/cn';

type DividerProps = {
  horizontal?: boolean;
  color?: string;
  darkColor?: string;
  thickness?: number;
  className?: string;
};

export const Divider = ({
  horizontal = true,
  color = '#E5E7EB', // light: gray-200
  darkColor = '#6b7280', // dark: gray-500
  thickness = 1,
  className,
}: DividerProps) => {
  const colorScheme = useColorScheme();
  const currentColor = colorScheme === 'dark' ? darkColor : color;

  const style = horizontal
    ? { height: thickness, backgroundColor: currentColor }
    : { width: thickness, backgroundColor: currentColor };

  return <View className={cn(horizontal ? 'w-full' : 'h-full', className)} style={style} />;
};
