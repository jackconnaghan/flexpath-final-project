import { createContext, useContext, useState } from 'react';
import { apiAuthFetch } from '../logic/apiAuth';

const AuthContext = createContext(window.sessionStorage.getItem("key"));

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(null);
    const { login } = apiAuthFetch();

    //calls apiAuthLogin with the username and password
    //sets sessionStorage.key to the token
    //and sets auth to the token,
    //allowing pages to cross-reference the token's validity
    async function login(username, password) {
        const token = await login(`/api/auth/login`, "POST", {username, password});
        window.sessionStorage.setItem("key", token);
        setToken(token);
        return null;
    }
    //undoes sessionStorage key and
    //sets auth to null again, ending logged-in state context-wide
    function logout() {
        window.sessionStorage.setItem("key", null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);