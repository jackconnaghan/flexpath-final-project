//checked for external dependencies imports
// import { useAuthStore } from "../stores/authorizationStore";
// import keycloak from "../keycloak";
// import { useWishListStore } from "../stores/useWishListStore";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import LoginFormComponent from "./LoginFormComponent";

export default function RequireAuth({ children, role, customMessage }) {

    // const { useAuth } = AuthContextProvider();
    // const login = useAuth.login();
    // const logout = useAuth.logout();
    const { isLoggedIn, roles } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return (
            <div>
                <p>{customMessage ?? "Please log in to view this page."}</p>
                <LoginFormComponent />   {/* your login form component, once it exists */}
            </div>
        );
    }
    if (role && !roles.includes(role)) {
        return <p>{customMessage}</p>;
    }
    return children;
}