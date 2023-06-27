'use client';

import {createContext, ReactNode, useContext, useState} from 'react';


interface IAuthContext {
    setJwt: (jwt: string) => void;
    getJwt: () => string | null;
    isLoggedIn: () => boolean;
}

export const AuthContext = createContext<IAuthContext>({
    setJwt: () => null,
    getJwt: () => null,
    isLoggedIn: () => false,
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [jwt, setJwt] = useState<string | null>(null);

    const getJwt = () => jwt;
    const isLoggedIn = () => !!jwt;

    return (
        <AuthContext.Provider value={{setJwt, getJwt, isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}




