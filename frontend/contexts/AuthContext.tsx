'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'professor' | 'student';
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // On mount, load token and user from cookies (if available)
    useEffect(() => {
        const storedToken = Cookies.get('token') || null;
        const storedUser = Cookies.get('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user cookie', error);
            }
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        Cookies.set('token', newToken, { expires: 7 });
        Cookies.set('user', JSON.stringify(newUser), { expires: 7 });
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
