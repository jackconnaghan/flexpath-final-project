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
    const { isLoggedIn, logout, username, roles } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

        //sends user back to home page after logout
    function handleLogout() {
        // setMenuVisible(false);
        logout();
        navigate("/");
    }

    if (!isLoggedIn) {
        return (
            <div className="extend-under-navbar">
                <p>{customMessage}</p>
                <LoginPromptComponent location={location} />
            </div>
        );
    }
    
    // if (role && !roles.includes(role)) {
    //     return <p className>{customMessage}</p>;

    // }
    return children;
}