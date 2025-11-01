import { ProductType } from '@model/product';
import { useRootStore } from '@providers/RootStoreContext';
import Button from '@components/Button';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import style from './ClearProductsButton.module.scss';

const ClearActionSlot: React.FC<{ product: ProductType }> = ({ product }) => {
  const { cartStore } = useRootStore();

  return (
    <Button priority="secondary" onClick={() => cartStore.removeAllProductItems(product)} className={clsx(style['action-slot__button'])}>
      Удалить все
    </Button>
  );
};

export default observer(ClearActionSlot);
