import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ServerConfig {
    id: string;
    name: string;
    description: string;
    address: string;
}

interface ServerAddressContextType {
    servers: ServerConfig[];
    loaded: boolean;
    updateServerConfig: (id: string, name: string, description: string, address: string) => void;
    addServerConfig: (name: string, description: string, address: string) => void;
    deleteServerConfig: (id: string) => void;
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

const STORAGE_KEY = '@smartfarm/server-configs';

export function ServerAddressProvider({ children }: { children: React.ReactNode }) {
    const [servers, setServers] = useState<ServerConfig[]>(INITIAL_SERVERS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((saved) => {
                if (!saved) return;
                const parsed: unknown = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(item =>
                    item && typeof item.id === 'string' && typeof item.name === 'string'
                    && typeof item.description === 'string' && typeof item.address === 'string'
                )) {
                    setServers(parsed as ServerConfig[]);
                }
            })
            .catch(() => {
                // The default configuration remains usable if local storage is unavailable.
            })
            .finally(() => setLoaded(true));
    }, []);

    const save = (next: ServerConfig[]) => {
        setServers(next);
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const updateServerConfig = (id: string, name: string, description: string, address: string) => {
        save(servers.map((srv) => srv.id === id ? { ...srv, name, description, address } : srv));
    };

    const addServerConfig = (name: string, description: string, address: string) => {
        const newId = `Server_${Date.now()}`;
        save([...servers, { id: newId, name, description, address }]);
    };

    const deleteServerConfig = (id: string) => {
        save(servers.filter((srv) => srv.id !== id));
    };

    return (
        <ServerAddressContext.Provider value={{ servers, loaded, updateServerConfig, addServerConfig, deleteServerConfig }}>
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
