import { useAuthStore } from "../stores/authorizationStore";
import keycloak from "../keycloak";
import { NavLink } from "react-router-dom";

//this function is used to show a user's name in the navbar
//if they are logged in. If they are not logged in,
//it shows a prompt to log in or create an account.
export default function ShowAuth({ children, role }) {
    const status = useAuthStore((s) => s.status);
    const user = useAuthStore((s) => s.user);

    if (status === "anonymous") {
        const here = window.location.href;   // come back to this page afterward
        return (
            <div className="text-center">
                <button type="button" className="btn btn-success me-2"
                    onClick={() => keycloak.login({ redirectUri: here })}>
                    Log in
                </button>
                <button type="button" className="btn btn-outline-success"
                    onClick={() => keycloak.register({ redirectUri: here })}>
                    Create an account
                </button>
            </div>
        );
    } else if (status === "authenticated") {
        const here = window.location.href;
        return (
            <div className="text-center row log-buttons">
                <NavLink className="col-auto">Hello, {user.username}</NavLink>
                {/* <button type="button" className="btn btn-success me-2"
                    onClick={() => keycloak.login({ redirectUri: here })}>
                    Log in
                </button>
                <button type="button" className="btn btn-outline-success"
                    onClick={() => keycloak.register({ redirectUri: here })}>
                    Create an account
                </button> */}
                <button type="button" className="col btn btn-success log-buttons" 
                onClick={() => keycloak.logout({ redirectUri: here })}>
                    Logout
                </button>
            </div>
        );
    }

    if (role && !user.roles.includes(role)) {
        return <p className="text-center my-5">You don't have permission to view this page.</p>;
    }

    return children;
}