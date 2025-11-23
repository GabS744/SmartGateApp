import React from 'react';
import { View, ViewProps } from 'react-native';
import { Svg, Path, type SvgProps } from 'react-native-svg';

interface ShapeProps extends SvgProps {
  className?: string;
  color?: string;
  children?: React.ReactNode;
  containerStyle?: ViewProps['style'];
}

const Shape = ({
  className,
  color = '#131E46',
  width = '100%',
  height = '205',
  children,
  containerStyle,
  ...props
}: ShapeProps) => {
  return (

    <View className="relative w-full items-center justify-center">
      <Svg
        className={className}
        width={width}
        height={height}
        viewBox="0 0 438 205"
        fill="none"
        preserveAspectRatio="none"
        {...props}>
        <Path d="M0 0H438V169.046H214.5H107C39.0935 167.309 23 184.185 0 205V0Z" fill={color} />
      </Svg>

      {children && (
        <View
          className="absolute left-0 top-0 h-full w-full items-center justify-center p-4"
          style={containerStyle}>
          {children}
        </View>
      )}
    </View>
  );
};

export default Shape;
