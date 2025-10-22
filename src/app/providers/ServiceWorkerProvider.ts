"use client";

import useServiceWorker from "@hooks/useServiceWorker";

const ServiceWorkerProvider: React.FC = () => {
    useServiceWorker();

    return null;
};

export default ServiceWorkerProvider;