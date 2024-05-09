import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from '../../services/firebase';

interface AuthContextType {
    userAuth: {
        auth: User | null; 
        user: any; 
    };
    setUserAuth: React.Dispatch<React.SetStateAction<{
        auth: User | null| any;
        user: any;
    }>>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({userAuth: {auth: null, user: null}, setUserAuth: () => {}});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userAuth, setUserAuth] = useState<{ auth: User | null; user: any }>({
        auth: null,
        user: null,
    });
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserAuth((prevUserAuth) => ({
                ...prevUserAuth,
                auth: user,
            }));
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ userAuth, setUserAuth }}>
            {children}
        </AuthContext.Provider>
    );
};