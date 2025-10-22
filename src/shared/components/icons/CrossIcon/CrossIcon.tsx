import React from 'react';
import Icon, { type IconProps } from '../Icon';

const CrossIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...rest }) => {

return (
    
    <Icon {...rest} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
};

export default CrossIcon;
