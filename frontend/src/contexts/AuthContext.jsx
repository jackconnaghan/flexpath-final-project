import { createContext, useContext, useState } from 'react';
import { loginUser, signUpNewUser } from '../logic/apiAuth';
import { getRoles } from '../logic/apiUtils';
//this is a fallback 
//and is NEVER used inside the provider (where you intent to use it)
const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [username, setUsername] = useState(() => sessionStorage.getItem("username"));
    const roles = token ? getRoles(token) : [];

    const [error, setError] = useState(false);

    //calls apiAuthLogin with the username and password
    //sets sessionStorage.key to the token
    //and sets auth to the token,
    //allowing pages to cross-reference the token's validity
    async function login(username, password) {
        setError(false);
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

    async function signUp(username, password) {
        setError(null);
        // setLoading(true);
        try {
            const data = await signUpNewUser(username, password);
            //on success, log new user in 
            const token = await loginUser(username, password);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("username", username);
            setToken(token); //controls react renders
            setUsername(username);
            return data;
        } catch (err) {
            setError(err.status === 409 
                ? "a user with that username already exists...awkward"
                : err.message
            );
            throw err;
        }
        // const data = await signUpNewUser(username, password);
        // if (data.ok) {
        //     const token = await loginUser(username, password);
        //     sessionStorage.setItem("token", token);
        //     sessionStorage.setItem("username", username);
        //     setToken(token); //controls react renders
        //     setUsername(username);
        // }
    }

    //the below uses a fun thing to set a bool:
    //isLoggedIn: !!token
    //will be true if token is not null
    //and false if token is null
    return (
        <AuthContext.Provider value={{ token, username, roles, isLoggedIn: !!token, login, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);