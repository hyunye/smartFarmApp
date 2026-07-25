import React, { createContext, useContext, useState } from 'react';

export interface ServerConfig {
    id: string;
    name: string;
    description: string;
    address: string;
}

interface ServerAddressContextType {
    servers: ServerConfig[];
    updateServerConfig: (id: string, name: string, description: string, address: string) => void;
    addServerConfig: (name: string, description: string, address: string) => void;
}

const ServerAddressContext = createContext<ServerAddressContextType | undefined>(undefined);

const INITIAL_SERVERS: ServerConfig[] = [
    {
        id: 'Server1',
        name: 'Server1',
        description: 'description1',
        address: 'http://192.168.0.10',
    },
    {
        id: 'Server2',
        name: 'Server2',
        description: 'description2',
        address: 'http://192.168.0.11',
    },
];

export function ServerAddressProvider({ children }: { children: React.ReactNode }) {
    const [servers, setServers] = useState<ServerConfig[]>(INITIAL_SERVERS);

    const updateServerConfig = (id: string, name: string, description: string, address: string) => {
        setServers((prev) =>
            prev.map((srv) =>
                srv.id === id ? { ...srv, name, description, address } : srv
            )
        );
    };

    const addServerConfig = (name: string, description: string, address: string) => {
        const newId = `Server_${Date.now()}`;
        setServers((prev) => [
            ...prev,
            { id: newId, name, description, address },
        ]);
    };

    return (
        <ServerAddressContext.Provider value={{ servers, updateServerConfig, addServerConfig }}>
            {children}
        </ServerAddressContext.Provider>
    );
}

export function useServerAddress() {
    const context = useContext(ServerAddressContext);
    if (context === undefined) {
        throw new Error('useServerAddress must be used within a ServerAddressProvider');
    }
    return context;
}
