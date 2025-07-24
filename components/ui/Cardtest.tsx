import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { cn } from '~/utils/cn';
import { clsx } from 'clsx';
import { Text } from '~/components/ui/Text';

type CardProps = {
  image?: ImageSourcePropType;
  simple?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export const Cardtest = ({
  image,
  simple = false,
  className,
  contentClassName,
  children,
}: CardProps) => {
  // Sizes: full height for an image card, smaller for a simple version
  const cardHeight = simple ? 'h-26' : 'h-64';

  return (
    <View
      className={cn(
        'my-2 rounded-2xl border-[1px] border-gray-200 bg-white shadow-md shadow-app-800/10 dark:border-gray-500 dark:bg-gray-900',
        'h-auto',
        className
      )}>
      {/* Show image or just background */}
      {image ? (
        <Image source={image} resizeMode="cover" className="absolute h-16 w-full" />
      ) : null}

      {/* White overlay for content */}
      <View
        className={cn(
          // 'flex-1',
          image && !simple
            ? 'justify-end bg-white dark:bg-app' // semi-transparent overlay on image
            : 'bg-white dark:bg-gray-900',
          contentClassName
        )}
        style={image && !simple ? { paddingBottom: 0 } : undefined}>
        {children}
      </View>
    </View>
  );
};

export const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <View className={cn('p-5', className)}>{children}</View>;

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <View>
    <View className="mb-1">
      <Text className={cn('text-xs font-bold uppercase', className)}>{children}</Text>
    </View>
  </View>
);

export const CardSubtitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <Text className={cn('mb-1 text-2xl font-bold', className)} numberOfLines={2}>
    {children}
  </Text>
);

export const CardFooter = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <View className={cn('px-5 pb-5', className)}>{children}</View>;

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <Text className={cn('text-sm text-white/80', className)}>{children}</Text>;
