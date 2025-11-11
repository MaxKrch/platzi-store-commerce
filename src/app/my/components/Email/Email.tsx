import { useRootStore } from '@providers/RootStoreContext';
import Field from '../Field';
import { useCallback, useEffect, useState } from 'react';
import { META_STATUS } from '@constants/meta-status';
import { authSchema } from '@schemas/auth.schema';

const Email: React.FC = () => {
    const { userStore, authStore } = useRootStore();
    const [error, setError] = useState<string | null>(userStore.error.updateEmail); 

    const handleSave = useCallback(async (value: string) => {
        const result = await userStore.updateUser({
            email: value
        });

        return result;
    }, [userStore]);

    const validate = useCallback(async (value: string): Promise<{ success: boolean, aborted?: boolean}> => {
        const result = authSchema.pick({ email: true }).safeParse({ email: value });
        if(!result.success) {
            setError(result.error.issues[0].message);
            return { success: false };

        } 
        
        const isAvailableEmail = await authStore.checkEmailAvailability(value);

        if(isAvailableEmail.aborted) {
            return { success: false, aborted: true };
        }
        if(isAvailableEmail.success) {
            setError(null);
            return { success: true };
        }

        if(isAvailableEmail.success === false) {
            setError('Email недоступен');
            return { success: false };     
        }

        setError(authStore.checkAvailableEmailError);
        return { success: false };                
    }, [authStore]);

    useEffect(() => {
        setError(userStore.error.updateEmail);
    }, [userStore.error.updateEmail]);

    return(
        <Field
            title='Email' 
            initValue={userStore.user?.email}
            disabled={authStore.isPending}
            saving={userStore.status.updateEmail === META_STATUS.PENDING}
            onSave={handleSave}
            error={error}
            type='email'
            validate={validate}
        />
    );
};

export default Email;