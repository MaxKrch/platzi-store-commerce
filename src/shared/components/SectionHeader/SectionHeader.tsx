import clsx from 'clsx';
import { memo, type FC } from 'react';

import style from './SectionHeader.module.scss';
import Text from '@components/Text';

export type SectionHeaderProps = {
  title: string;
  content: string[];
  className?: string;
};

const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  content,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={clsx(style['section-header'], className)}>
      <Text 
        tag="h1" 
        view="title" 
        color="primary" 
        weight="bold" 
        className={clsx(style['section-header__title'])}
      >
        {title}
      </Text>
      {content.map(item => (
        <Text
          key={item} 
          color="secondary" 
          view="p-20" 
          className={clsx(style['section-header__content'])}
        >
        {item}
      </Text>))}
    </div>
  );
};

export default memo(SectionHeader);
