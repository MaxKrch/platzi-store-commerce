import { useRootStore } from '@providers/RootStoreContext';
import Field from '../Field';
import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { META_STATUS } from '@constants/meta-status';

const Name: React.FC = () => {
    const { userStore, authStore } = useRootStore();

    const handleSave = useCallback(async (value: string) => {
        const result = await userStore.updateUser({
            name: value
        });

        return result;
    }, [userStore]);

    return(
        <Field
            title='Имя' 
            initValue={userStore.user?.name}
            disabled={authStore.isPending}
            saving={userStore.status.updateName === META_STATUS.PENDING}
            onSave={handleSave}
            error={userStore.error.updateName}
        />
    );
};

export default observer(Name);