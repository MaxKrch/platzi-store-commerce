"use client";

import Client from '@api/client';
import { IClient } from '@api/types';
import useCreateRootStore from '@store/RootStore';
import { IRootStore } from '@store/RootStore/RootStore';
import React, { type PropsWithChildren } from 'react';
import { useStrictContext } from '@hooks/useSctrictContext';
import { enableStaticRendering } from 'mobx-react-lite';
import { usePathname, useSearchParams } from 'next/navigation';

export const isServer = typeof window === "undefined";
enableStaticRendering(isServer);

const RootStoreContext = React.createContext<IRootStore | null>(null);

let client: IClient;

export const RootStoreProvider: React.FC<PropsWithChildren> = ({ children }) => { 
  const path = usePathname();
  const queryParams = useSearchParams();
  const createClient = () => new Client();
  client = client ?? createClient();  
  
  const rootStore = useCreateRootStore({ client, path, queryParams });

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => {
  return useStrictContext({
    context: RootStoreContext,
    message: 'RootStoreContext was not provided',
  });
};

