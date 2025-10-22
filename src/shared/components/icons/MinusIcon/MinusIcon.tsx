import React from 'react';

import Icon, { type IconProps } from '../Icon';

const MinusIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...rest }) => {
  return (
    <Icon {...rest} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
};

export default MinusIcon;
