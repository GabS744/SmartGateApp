import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { 
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  LucideIcon
} from 'lucide-react-native';

type ButtonSize = 'small' | 'medium' | 'large' | 'long small' | 'long medium' | 'long large';
type ButtonVariant = 'primary' | 'secondary';
type IconName = 'arrow-right' | 'check' | 'plus' | 'trash' | 'edit' | 'save' | 'close';

interface StylizedButtonProps {
  text?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode | IconName;
  rightIcon?: React.ReactNode | IconName;
  topIcon?: React.ReactNode | IconName;
  bottomIcon?: React.ReactNode | IconName;
  iconColor?: string;
  iconSize?: number;
  borderRadius?: number;
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

export function StylizedButton({
  text = 'Botão',
  onPress,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  topIcon,
  bottomIcon,
  iconColor,
  iconSize,
  borderRadius = 4,
  width,
  height,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  textClassName = '',
}: StylizedButtonProps) {
  
  const renderIcon = (icon: React.ReactNode | IconName, defaultSize: number) => {
    if (typeof icon === 'string') {
      const iconMap: Record<IconName, LucideIcon> = {
        'arrow-right': ArrowRight,
        'check': Check,
        'plus': Plus,
        'trash': Trash2,
        'edit': Edit,
        'save': Save,
        'close': X,
      };
      
      const IconComponent = iconMap[icon as IconName];
      const finalIconColor = iconColor || (variant === 'primary' ? '#FFFFFF' : '#283B7D');
      const finalIconSize = iconSize || defaultSize;
      
      return <IconComponent size={finalIconSize} color={finalIconColor} />;
    }
    return icon;
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          containerClass: 'py-2 px-4',
          textClass: 'text-xs',
          iconSize: 16,
        };
      case 'large':
        return {
          containerClass: 'py-4 px-8',
          textClass: 'text-base',
          iconSize: 22,
        };
      case 'long small':
        return {
          containerClass: 'py-2 px-4 w-full',
          textClass: 'text-xs',
          iconSize: 16,
        };
      case 'long medium':
        return {
          containerClass: 'py-3 px-6 w-full',
          textClass: 'text-sm',
          iconSize: 18,
        };
      case 'long large':
        return {
          containerClass: 'py-4 px-8 w-full',
          textClass: 'text-base',
          iconSize: 22,
        };
      default:
        return {
          containerClass: 'py-3 px-6',
          textClass: 'text-sm',
          iconSize: 18,
        };
    }
  };

  const sizeConfig = getSizeConfig();
  const finalIconColor = iconColor || (variant === 'primary' ? '#FFFFFF' : '#283B7D');
  const isVertical = !!(topIcon || bottomIcon);

  const variantClass = variant === 'primary' 
    ? 'bg-[#131E46]' 
    : 'bg-white border-2 border-[#131E46]';

  const textVariantClass = variant === 'primary' ? 'text-white' : 'text-[#131E46]';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={`items-center justify-center ${variantClass} ${sizeConfig.containerClass} ${fullWidth ? 'w-full' : ''} ${(disabled || loading) ? 'opacity-50' : ''} ${isVertical ? 'py-4' : ''} ${className}`}
      style={[
        { borderRadius },
        width !== undefined && { width: width as any },
        height !== undefined && { height: height as any },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={finalIconColor} size="small" />
      ) : (
        <View className={`flex items-center justify-center ${isVertical ? 'flex-col' : 'flex-row'}`}>
          {topIcon && (
            <View className="mb-2">
              {renderIcon(topIcon, sizeConfig.iconSize)}
            </View>
          )}
          
          <View className="flex-row items-center justify-center">
            {leftIcon && (
              <View className="mr-2">
                {renderIcon(leftIcon, sizeConfig.iconSize)}
              </View>
            )}
            
            <Text className={`font-semibold ${textVariantClass} ${sizeConfig.textClass} ${textClassName}`}>
              {text}
            </Text>
            
            {rightIcon && (
              <View className="ml-2">
                {renderIcon(rightIcon, sizeConfig.iconSize)}
              </View>
            )}
          </View>
          
          {bottomIcon && (
            <View className="mt-2">
              {renderIcon(bottomIcon, sizeConfig.iconSize)}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// Exemplos de uso:
/*
import { StylizedButton } from './StylizedButton';
import { View } from 'react-native';

function MyScreen() {
  return (
    <View className="p-5 gap-4">
      <StylizedButton />
      <StylizedButton text="Entrar" onPress={() => console.log('Login')} />
      <StylizedButton text="Salvar" leftIcon="save" />
      <StylizedButton text="Continuar" rightIcon="arrow-right" />
      <StylizedButton text="Cancelar" variant="secondary" />
      <StylizedButton text="Pequeno" size="small" />
      <StylizedButton text="Grande" size="large" />
      <StylizedButton text="Adicionar" leftIcon="plus" variant="secondary" />
      <StylizedButton text="Upload" topIcon="plus" />
      <StylizedButton text="Carregando..." loading={true} />
      <StylizedButton text="Desabilitado" disabled={true} />
      <StylizedButton text="Entrar" fullWidth />
      <StylizedButton text="Custom" className="bg-red-500" />
      <StylizedButton text="Arredondado" borderRadius={20} />
    </View>
  );
}
*/