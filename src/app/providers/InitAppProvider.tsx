"use client";

import useInitApp from "@hooks/useInitApp";
import { PropsWithChildren } from "react";

const InitAppProvider: React.FC<PropsWithChildren> = ({ children }) => {
    useInitApp();

    return (
        <>
            {children}
        </>
    );
};

export default InitAppProvider;