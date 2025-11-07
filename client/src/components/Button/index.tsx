import React from 'react';
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps, // Importamos as props nativas
} from 'react-native';


interface ButtonProps extends TouchableOpacityProps {
  // TouchableOpacityProps já inclui 'onPress', 'style', 'disabled', etc.
  title: string; // O texto que o botão vai exibir
  className?: string; // Para estilizar o container (TouchableOpacity)
  textClassName?: string; // Para estilizar o texto (Text)
}

// 2. Crie o componente Button
const Button = ({
  title,
  className,
  textClassName,
  disabled, 
  ...props
}: ButtonProps) => {

  const baseButtonStyles = 'py-3 px-6 rounded-lg bg-[#131E46] items-center justify-center';
  const baseTextStyles = 'text-white underline text-lg font-semibold';

  const disabledStyles = 'bg-gray-400 opacity-70';

  return (
    <TouchableOpacity

      className={`
        ${baseButtonStyles}
        ${disabled ? disabledStyles : ''}
        ${className} 
      `}
      disabled={disabled} 
      {...props} 
    >
      <Text
        className={`
          ${baseTextStyles}
          ${textClassName}
        `}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
