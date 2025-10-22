import React from 'react';

import Icon, { type IconProps } from '../Icon';

const CheckIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...rest }) => {
  return (
    <Icon {...rest} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M4 11.6129L9.87755 18L20 7" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
};

export default CheckIcon;
