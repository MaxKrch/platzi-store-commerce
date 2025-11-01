import 'client-only';
import { useEffect } from "react";

const useServiceWorker = () => {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) {
            return;
        }
        
        navigator.serviceWorker.register("/service-worker.js")
            .catch(error => {
                if (process.env.NODE_ENV !== "production") {
                    console.error("SW registration failed", error);
                }  
            });
    }, []);  
};

export default useServiceWorker;
