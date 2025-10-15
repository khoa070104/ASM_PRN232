import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "./types";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (token: string, user: User) => void;
	logout: () => void;
	isAuthenticated: boolean;
	isAdmin: boolean;
    isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
		// Load auth data from localStorage on mount
		const savedToken = localStorage.getItem("auth_token");
		const savedUser = localStorage.getItem("auth_user");
		
		if (savedToken && savedUser) {
			setToken(savedToken);
			setUser(JSON.parse(savedUser));
		}
        setIsReady(true);
	}, []);

	const login = (newToken: string, newUser: User) => {
		setToken(newToken);
		setUser(newUser);
		localStorage.setItem("auth_token", newToken);
		localStorage.setItem("auth_user", JSON.stringify(newUser));
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_user");
	};

	const isAuthenticated = !!token && !!user;
	const isAdmin = user?.role === "Admin";

	const value: AuthContextType = {
		user,
		token,
		login,
		logout,
		isAuthenticated,
		isAdmin,
        isReady,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
