//bones are from api.js
//stores username, roles, and token of a user's session
//handles login, logout, refresh?

export async function apiAuthFetch() {

    async function login(url, { method = "GET", body } = []) {
        //set up headers object
        const headers = {};

        //if body has contents, set headers to JSON
        if (body !== undefined) headers["Content-Type"] = "application/json";
        if (token) headers.Authorization = `Bearer ${token}`;

        //from here,
        //need one call to establish a username
        //and another call to establish that user's roles

        //here goes
        const response = await fetch(url, {
            method,
            //token body is in the header in Authorization, you JUST set that upstairs
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        //this doesn't actually attach the error to the response obj,
        //so there's no way to attach this error to the returns from useFetch
        //with the setError state setter.

        // if (!response.ok) {
        //     throw new Error(`Request failed with status ${response.status}`);
        // }

        //do this instead. It adds the err.status to response.status 
        if (!response.ok) {
            const problem = await response.json().catch(() => null);
            const err = new Error(problem?.detail || `Request failed with status ${response.status}`);
            err.status = response.status;      // without this, the hook has no status to save
            throw err;
        }

        return response.status === 204 ? null : response.json();
    }

    async function logout(url, { method = "GET", body } = []) {
        const response = await fetch(url, {
            method
        });

        //putting this here in case I have to show a "failed to log out" response,
        //which I don't anticipate, but I'm not quite sure what eu.fraho is doing yet
        return response.status === 200 ? null : response.json();
    }

}

// Example of writing to storage

// window.sessionStorage.setItem("key", "value");
// To retrieve item from storage use

// window.sessionStorage.getItem("key");