import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/api/Auth/login', { email, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        return decoded;
    };

    const register = async (userData) => {
        await axios.post('/api/Auth/register', userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
