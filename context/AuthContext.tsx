import axiosInstance from "@/config/axiosConfig";
import { useStorageState } from "@/hooks/useStorageState";
import axios from "axios";
import { router } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    credits: number | null;
}

interface AuthContextType {
    signIn: (token: string, user: User) => void;
    signOut: () => void;
    session?: string | null;
    user?: User | null;
    isLoading: boolean;
    updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
    user: null,
    updateUser: async () => { }
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error("useSession must be wrapper insiide <SessionProvider />");
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[, user], setUser] = useStorageState('user');
    const updateUser = async (userData: any) => {
        await setUser(userData);
    }
    const handleSignOut = async () => {
        try {
            if (session) {
                await axiosInstance.post('/auth/logout', null, {
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                });
                setSession(null)
                setUser(null);
                router.replace('/sign-in');
            }
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    }
    const loadUserInfo = async (token: string) => {
        try {
            const response = await axiosInstance.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userData = response.data;
            setUser(JSON.stringify(userData));

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setSession(null);
                setUser(null);
                router.replace('/sign-in');
            } else {
                console.error("Error loading user info:", error);
            }
        }
    }

    useEffect(() => {
        if (session) {
            loadUserInfo(session);
        }
    }, [session]);
    const parsedUser = user ? (() => {
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
     }) : null;
    const handleUpdateUser = async (userData: any) => {
        try {
            const userString = JSON.stringify(userData);
            await setUser(userString);
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;    
        }
    }
    const handleSignIn = async (token: string, userData: User) => {
        try {
            await setSession(token);
            await setUser(JSON.stringify(userData));

        } catch (error) {
            console.error("Error during sign in:", error);
        }
    }

    return (
        <AuthContext.Provider value={{
            signIn: handleSignIn,
            signOut: handleSignOut,
            session,
            user: parsedUser,
            isLoading,
            updateUser: handleUpdateUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}