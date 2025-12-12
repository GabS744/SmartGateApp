import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string;
  textClassName?: string;
  noUnderline?: boolean;
  isLoading?: boolean;
}

const Button = ({
  title,
  className,
  textClassName,
  disabled,
  noUnderline,
  isLoading = false,
  ...props
}: ButtonProps) => {
  const baseButtonStyles = 'py-3 px-6 rounded-lg bg-[#131E46] items-center justify-center flex-row';
  const baseTextStyles = 'underline text-lg font-semibold';
  const disabledStyles = 'bg-gray-400 opacity-70';

  // Define a cor do spinner. Se o texto for escuro (botão branco), spinner escuro; senão branco.
  const spinnerColor =
    textClassName?.includes('text-[#131E46]') || textClassName?.includes('text-blue')
      ? '#131E46'
      : 'white';

  return (
    <TouchableOpacity
      className={`
        ${baseButtonStyles}
        ${disabled || isLoading ? disabledStyles : ''}
        ${className} 
      `}
      disabled={disabled || isLoading}
      {...props}>
      {isLoading ? (
        <ActivityIndicator size="small" color={spinnerColor} className="mr-2" />
      ) : (
        <Text
          className={`
            ${baseTextStyles}
            ${textClassName || 'text-white'}
            ${noUnderline ? 'no-underline' : ''}
          `}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
