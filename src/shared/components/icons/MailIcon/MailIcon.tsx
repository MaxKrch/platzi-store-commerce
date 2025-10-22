import React from 'react';

import Icon, { type IconProps } from '../Icon';

const MailIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...rest }) => {
  return (
    <Icon {...rest} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <rect 
        x="2.2" 
        y="5" 
        width="19.6" 
        height="14" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      <path 
        d="M3.2 7.5L12 13.2L20.8 7.5" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </Icon>
  );
};

export default MailIcon;
