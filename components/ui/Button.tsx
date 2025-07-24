import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { cn } from '~/utils/cn';
import { Text } from '~/components/ui/Text';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tonal' | 'plain' | 'icon';
  size?: ButtonSize;
  title?: string;
  icon?: string; // Provide legit Ionicons name
  loading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
};

const variantStyles = {
  primary: 'flex-row items-center justify-center bg-app rounded-xl dark:bg-app',
  secondary: 'flex-row items-center justify-center border border-blue-500 rounded-xl bg-white',
  tonal: 'flex-row items-center justify-center bg-blue-100 rounded-xl',
  plain: 'flex-row items-center justify-center bg-transparent',
  icon: 'items-center justify-center bg-blue-100 rounded-xl',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 min-h-8',
  md: 'px-6 py-3 min-h-12',
  lg: 'px-8 py-4 min-h-16',
};

const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const textStyles = {
  primary: 'text-gray-100 font-medium dark:text-gray-300',
  secondary: 'text-blue-500 font-medium dark:text-blue-500',
  tonal: 'text-blue-700 font-medium',
  plain: 'text-black font-medium',
};

const textSize = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  title,
  icon,
  loading,
  onPress,
  disabled,
  className,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={cn(
        variantStyles[variant],
        variant === 'icon' ? 'h-12 w-12 p-3' : sizeStyles[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563eb'} />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon as any}
              size={iconSize[size]}
              color={
                variant === 'primary'
                  ? '#fff'
                  : variant === 'tonal' || variant === 'icon'
                    ? '#2563eb'
                    : '#2563eb'
              }
            />
          )}
          {title && variant !== 'icon' && (
            <Text
              className={cn(
                textStyles[variant],
                textSize[size],
                icon && 'ml-2',
                disabled && 'opacity-70'
              )}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
