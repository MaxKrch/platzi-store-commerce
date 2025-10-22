import Button from '@components/Button';
import React from 'react';

const DefaultNetworkErrorActionSlot: React.FC<{ action: () => void }> = ({ action }) => {
  return <Button onClick={action}>{'Мне повезет!'}</Button>;
};

export default DefaultNetworkErrorActionSlot;
