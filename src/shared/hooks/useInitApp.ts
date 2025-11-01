import 'client-only';
import { useRootStore } from '@providers/RootStoreContext';
import { useEffect } from 'react';

const useInitApp = () => {
    const { authStore } = useRootStore();
    
    useEffect(() => {
        authStore.initAuth();
    }, [authStore]);
};

export default useInitApp;