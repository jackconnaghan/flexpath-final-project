import { create } from "zustand";
import keycloak from "../keycloak";

export const useAuthStore = create((set) => ({
    status: "loading", //checks "loading", "authenticatied", and "anonymous"
    user: null,
    //REMOVED FOR KEYCLOAK-JS MIGRATION
    // checkAuth: async () => {
    //     try {
    //         const res = await fetch("/api/me");
    //         if (res.ok) {
    //             set({ status: "authenticated", user: await res.json() });
    //         } else {
    //             set({ status: "anonymous", user: null });
    //         }
    //     } catch {
    //         set({ status: "anonymous", user: null });   // backend down or network error
    //     }
    // },

    // Called when any API request comes back 401 (session expired)
    //markLoggedOut: () => set({ status: "anonymous", user: null }),

}));

export function syncAuthFromKeycloak() {
    if (keycloak.authenticated) {
        const theToken = keycloak.tokenParsed;
        useAuthStore.setState({
                status: "authenticated",
            user: {
                username: theToken.preferred_username,
                roles: theToken.roles ?? theToken.realm_access?.roles ?? [],
            },
        })
    } else {
        useAuthStore.setState({
            status: "anonymous",
            user: null
        });
    }
}

//these set events so they point back to the syncAuth function above
keycloak.onAuthSuccess = syncAuthFromKeycloak;
keycloak.onAuthLogout = syncAuthFromKeycloak;
keycloak.onAuthRefreshError = syncAuthFromKeycloak;

//these consts reassign the log keywords to direct to specific redirectURIs
export const login = () => keycloak.login({ redirectUri: window.location.href }); //exact same page they were on when the redirect was initiated
export const logout = () => keycloak.logout({ redirectUri: `${window.location.origin}/` });
export const register = () => keycloak.register();