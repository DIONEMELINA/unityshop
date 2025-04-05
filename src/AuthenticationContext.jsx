import { createContext, useContext, useState } from "react";
import { loginUser, registerUser, logoutUser, getStoredUser } from "./authServices";
import React from "react";
const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser());

    //handle login

    const login = async ({ email: email, password: password }) => {
        try {
            const loggedInUser = await loginUser({ email: email, password: password });
            setUser(loggedInUser);
            return 'success'
        } catch (error) {
            console.error("registration failed", error.response?.data || error.message);
            throw error
        }
        
    }

    //handle logout
    const logout = async () => {
       try {
           await logoutUser();
           setUser(null);
               
       } catch (error) {
           console.error('logout failed', error.response?.data || error.message);
           throw error
       }
       
        
    }

    return (
        <AuthContext.Provider value={{ logout, login, registerUser, user }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}