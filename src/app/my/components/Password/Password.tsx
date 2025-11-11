import { useRootStore } from '@providers/RootStoreContext';
import Field from '../Field';
import { useCallback, useEffect, useState } from 'react';
import { META_STATUS } from '@constants/meta-status';
import { authSchema } from '@schemas/auth.schema';

const Password: React.FC = () => {
    const { userStore, authStore } = useRootStore();
    const [error, setError] = useState<string | null>(userStore.error.updateEmail); 

    const handleSave = useCallback(async (value: string) => {
        const result = await userStore.updateUser({
            password: value
        });

        return result;
    }, [userStore]);

    const validate = useCallback(async (value: string): Promise<{ success: boolean }> => {
        const result = authSchema.pick({ password: true }).safeParse({ password: value });
        if(!result.success) {
            setError(result.error.issues[0].message);
        } else {
            setError(null);
        }

        return result;
    }, []);

    useEffect(() => {
        setError(userStore.error.updatePassword);
    }, [userStore.error.updatePassword]);

    return(
        <Field
            title='Пароль' 
            initValue={userStore.user?.password}
            disabled={authStore.isPending}
            saving={userStore.status.updatePassword === META_STATUS.PENDING}
            onSave={handleSave}
            error={error}
            type='password'
            validate={validate}
        />
    );
};

export default Password;