//checked for external dependencies imports
// import { useAuthStore } from "../stores/authorizationStore";
// import keycloak from "../keycloak";
// import { useWishListStore } from "../stores/useWishListStore";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

//I'm pretty sure this just keeps shit hidden unless the user has an account
export default function RevealOnAuth({ children, role }) {
    // const status = useAuthStore((s) => s.status);
    // const user = useAuthStore((s) => s.user);
    const { isLoggedIn, roles } = useAuth();
    const location = useLocation();


    if (!isLoggedIn) {
        // const here = window.location.href;   // come back to this page afterward
        // return (
        //     <div className="text-center my-5">
        //         <p>{customMessage}</p>
        //         <button type="button" className="btn btn-success me-2"
        //             onClick={() => keycloak.login({ redirectUri: here })}>
        //             Log in
        //         </button>
        //         <button type="button" className="btn btn-outline-success"
        //             onClick={() => keycloak.register({ redirectUri: here })}>
        //             Create an account
        //         </button>
        //     </div>
        // );
        return null;
    }

    // if (isLoggedIn && role && !roles.includes(role)) {
    //     // return <p className="text-center my-5">You don't have permission to view this page.</p>;
    //     return null;
    // }

    return children;
}