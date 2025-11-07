import React from 'react';
import { TouchableOpacity, Text, type TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string;
  textClassName?: string;
  noUnderline?: boolean;
}

const Button = ({
  title,
  className,
  textClassName,
  disabled,
  noUnderline,
  ...props
}: ButtonProps) => {
  const baseButtonStyles = 'py-3 px-6 rounded-lg bg-[#131E46] items-center justify-center';

  const baseTextStyles = 'underline text-lg font-semibold';

  const disabledStyles = 'bg-gray-400 opacity-70';

  return (
    <TouchableOpacity
      className={`
        ${baseButtonStyles}
        ${disabled ? disabledStyles : ''}
        ${className} 
      `}
      disabled={disabled}
      {...props}>
      <Text
        className={`
          ${baseTextStyles}
          ${textClassName || 'text-white'}
          ${noUnderline ? 'no-underline' : ''}
        `}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
