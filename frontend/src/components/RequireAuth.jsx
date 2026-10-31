import { useAuthStore } from "../stores/authorizationStore";
import keycloak from "../keycloak";

export default function RequireAuth({ children, role }) {
    const status = useAuthStore((s) => s.status);
    const user = useAuthStore((s) => s.user);

    if (status === "loading") {
        return <p className="text-center my-5">Checking your login…</p>;
    }

    if (status === "anonymous") {
        const here = window.location.href;   // come back to this page afterward
        return (
            <div className="text-center my-5">
                <p>You need an account to add a book.</p>
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
    }

    if (role && !user.roles.includes(role)) {
        return <p className="text-center my-5">You don't have permission to view this page.</p>;
    }

    return children;
}