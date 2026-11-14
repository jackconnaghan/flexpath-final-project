//checked for external dependencies imports
// import { useAuthStore } from "../stores/authorizationStore";
// import keycloak from "../keycloak";
// import { useWishListStore } from "../stores/useWishListStore";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";


export default function RequireAuth({ children, role, customMessage }) {

    // const { useAuth } = AuthContextProvider();
    // const login = useAuth.login();
    // const logout = useAuth.logout();
    const { isLoggedIn, roles } = useAuth();
    const location = useLocation();

    if (isLoggedIn) {
        // Remember where they were headed, so login can send them back there
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    if (role && !roles.includes(role)) {
        return <p>{customMessage}</p>;
    }
    return children;
}