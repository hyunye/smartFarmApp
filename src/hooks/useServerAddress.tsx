import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
    getServerApiKey: (id: string) => Promise<string>;
    setServerApiKey: (id: string, apiKey: string) => Promise<void>;
}

const ServerAddressContext = createContext<ServerAddressContextType | undefined>(undefined);

const INITIAL_SERVERS: ServerConfig[] = [];

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
                    const migrated = (parsed as (ServerConfig & { apiKey?: unknown })[]).map(({ apiKey, ...server }) => {
                        if (typeof apiKey === 'string' && apiKey) void SecureStore.setItemAsync(`smartfarm-api-key/${server.id}`, apiKey);
                        return server;
                    });
                    setServers(migrated);
                    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
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

    const getServerApiKey = useCallback((id: string) => SecureStore.getItemAsync(`smartfarm-api-key/${id}`).then(value => value ?? ''), []);
    const setServerApiKey = useCallback(async (id: string, apiKey: string) => {
        const key = `smartfarm-api-key/${id}`;
        if (apiKey) await SecureStore.setItemAsync(key, apiKey);
        else await SecureStore.deleteItemAsync(key);
    }, []);

    const updateServerConfig = (id: string, name: string, description: string, address: string) => {
        save(servers.map((srv) => srv.id === id ? { ...srv, name, description, address } : srv));
    };

    const addServerConfig = (name: string, description: string, address: string) => {
        const newId = `Server_${Date.now()}`;
        save([...servers, { id: newId, name, description, address }]);
    };

    const deleteServerConfig = (id: string) => {
        void SecureStore.deleteItemAsync(`smartfarm-api-key/${id}`);
        save(servers.filter((srv) => srv.id !== id));
    };

    return (
        <ServerAddressContext.Provider value={{ servers, loaded, updateServerConfig, addServerConfig, deleteServerConfig, getServerApiKey, setServerApiKey }}>
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
