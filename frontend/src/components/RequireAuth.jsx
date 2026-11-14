import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import LoginFormComponent from "./LoginFormComponent";
import LoginPromptComponent from "./LoginPromptComponent";
import { getRoles } from "../logic/apiUtils";

export default function RequireAuth({ children, role, customMessage }) {

    // const { useAuth } = AuthContextProvider();
    // const login = useAuth.login();
    // const logout = useAuth.logout();
    // const roles = getRoles(sessionStorage.getItem("token"))l
    const { isLoggedIn, roles } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return (
            <div>
                <p>{customMessage ?? "Please log in to view this page."}</p>
                <LoginPromptComponent location={location} setMenuVisible={setMenuVisible}/>
            </div>
        );
    }
    if (role && !roles.includes(role)) {
        return <p>{customMessage}</p>;
    }
    return children;
}