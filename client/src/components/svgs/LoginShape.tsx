import React from 'react';

import { Svg, Path, type SvgProps } from 'react-native-svg';


interface ShapeProps extends SvgProps {
  className?: string;
}


const LoginShape = ({ className, ...props }: ShapeProps) => {
  return (

    <Svg
      className={className}
      width="438"
      height="205"
      viewBox="0 0 438 205"
      fill="none"
      {...props}
    >
      <Path
        d="M0 0H438V169.046H214.5H107C39.0935 167.309 23 184.185 0 205V0Z"
        fill="#131E46"
      />
    </Svg>
  );
};

export default LoginShape;