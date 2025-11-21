import { useRootStore } from '@providers/RootStoreContext';
import Field from '../Field';
import { useCallback, useEffect, useRef, useState } from 'react';
import { META_STATUS } from '@constants/meta-status';
import { authSchema } from '@schemas/auth.schema';


const Email: React.FC = () => {
    const { userStore, authStore } = useRootStore();
    const abortCtrl = useRef<AbortController | null>(null);
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
        
        if(abortCtrl.current) {
            abortCtrl.current.abort();
        }

        const controller = new AbortController();
        abortCtrl.current = controller;
        
        const isAvailableEmail = await authStore.checkEmailAvailability(value, { 
            signal: abortCtrl.current.signal
        });

        if(controller !== abortCtrl.current || isAvailableEmail.aborted) {
            return { success: false, aborted: true };
        }

        abortCtrl.current = null;

        if(isAvailableEmail.success) {
            setError(null);
            return { success: true };
        }

        if(isAvailableEmail.success === false) {
            setError('Email недоступен');
            return { success: false };     
        }

        setError(authStore.checkEmail.error);
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
            debounce={300}
        />
    );
};

export default Email;