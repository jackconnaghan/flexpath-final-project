import { createContext, useContext, useState } from 'react';
import { loginUser } from '../logic/apiAuth';
import { getRoles } from '../logic/api';
//this is a fallback 
//and is NEVER used inside the provider (where you intent to use it)
const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [username, setUsername] = useState(() => sessionStorage.getItem("username"));
    const roles = token ? getRoles(token) : [];

    //calls apiAuthLogin with the username and password
    //sets sessionStorage.key to the token
    //and sets auth to the token,
    //allowing pages to cross-reference the token's validity
    async function login(username, password) {
        // const data = await loginUser(`/api/auth/login`, { method: "POST", body: { username, password } });
        // const token = data.accessToken.token; //backup for refreshes
        const token = await loginUser(username, password);
        // const roles = token.getRoles();
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", username);
        setToken(token); //controls react renders
        setUsername(username);

        // return null;
    }
    //undoes sessionStorage key and
    //sets auth to null again, ending logged-in state context-wide
    function logout() {
        sessionStorage.removeItem("token");           // removeItem, never setItem(..., null)
        sessionStorage.removeItem("username");
        setToken(null);
        setUsername(null);
    }

    //the below uses a fun thing to set a bool:
    //isLoggedIn: !!token
    //will be true if token is not null
    //and false if token is null
    return (
        <AuthContext.Provider value={{ token, username, roles, isLoggedIn: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);