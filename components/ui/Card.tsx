import React, { HTMLAttributes, ReactNode } from 'react';
import { ImageSourcePropType, View } from 'react-native';

enum ECardVariant {
  DEFAULT = 'default',
  INFO = 'info',
  WARNING = 'warn',
  DANGER = 'danger',
  DARK = 'dark',
}

type CardProps = {
  className?: string;
  children: ReactNode;
  variant?: ECardVariant;
};

const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <View
      className={`rounded-2xl border-[1px] border-gray-200 bg-white shadow-md shadow-app-800/10 dark:border-gray-500 dark:bg-gray-900 ${className}`}
      {...props}>
      {children}
    </View>
  );
};

const Header = ({
  children,
  className = '',
  variant = ECardVariant.DEFAULT,
  ...props
}: CardProps) => {
  const variantClassMap = {
    default: 'bg-app-400',
    info: 'bg-info/40',
    warn: 'bg-warning/40',
    danger: 'bg-danger/40',
    dark: 'bg-app-700 text-app-100 print:bg-app-700',
  };
  return (
    <View
      className={`${variantClassMap[variant]} flex flex-row items-center justify-between rounded-t-xl p-4 ${className}`}
      {...props}>
      {children}
    </View>
  );
};

const Body = ({ children, className = '', ...props }: CardProps) => {
  return (
    <View className={`p-2 ${className}`} {...props}>
      {children}
    </View>
  );
};

const Footer = ({ children, className = '', ...props }: CardProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-between bg-app-400 p-2 ${className}`}
      {...props}>
      {children}
    </View>
  );
};

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
