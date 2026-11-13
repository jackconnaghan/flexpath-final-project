/*
Needs a complete refactor away from keycloak
My thoughts:

users need to access the site with or without logging in. Still need RequireAuth and 
ShowAuths, but they won't come from a store--need to be a context instead. 

AuthContext: stores a user's login context that is then shared across pages.
Perhaps it shares context status to another component that controls whether the 
information is shown. How to keep this local? keep thoughts short here

I will turn 
*/

// import keycloak from "../keycloak";

//cleaning up API calls so there's not a fucking million of them 
//(3 counts as a million)

//this is what Tanstack Query is.......anyway

//basic fetch wrapper that handles authentication and the actual fetch call
//works IN TANDEM with the useFetch hook(s)
//api.js -> makes call
//useFetch -> tracks state of call for React compatability

//this is a cool params thing:
//url is url,
//but {method, body} is a destructured object.
//method gets set to GET as default,
//and the destructured object itself gets a default value of [].
//Cool!
export async function apiFetch(url, { method = "GET", body } = []) {
    //set up headers object
    const headers = {};

    //if body has contents, set headers to JSON
    if (body !== undefined) headers["Content-Type"] = "application/json";

    if (keycloak.authenticated) {
        await keycloak.updateToken(30); //keeps token updated, doesn't log user out so quickly
        //couldn't do this with Content-Type as that has a hyphen, but it's the same operation
        headers.Authorization = `Bearer ${keycloak.token}`;
    }

    //here goes
    const response = await fetch(url, {
        method,
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
        err.status = response.status;      // ← without this, the hook has no status to save
        throw err;
    }

    return response.status === 204 ? null : response.json();
}