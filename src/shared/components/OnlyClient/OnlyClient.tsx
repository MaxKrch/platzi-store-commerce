"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";

const OnlyClient: React.FC<PropsWithChildren> = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? children : null;
};

export default OnlyClient;