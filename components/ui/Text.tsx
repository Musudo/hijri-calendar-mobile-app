import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useFontFamily } from '~/providers/FontProvider';
import { cn } from '~/utils/cn';

interface AppTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ style, children, className, ...props }: AppTextProps) => {
  const fontFamily = useFontFamily();

  return (
    <RNText
      style={[{ fontFamily: fontFamily || fontFamily }, style]}
      className={cn('text-gray-700 dark:text-gray-400', className)}
      {...props}>
      {children}
    </RNText>
  );
};
