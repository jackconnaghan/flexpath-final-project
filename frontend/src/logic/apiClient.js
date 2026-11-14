//bones are from api.js
//
//this apiClient fetches the token from the AuthContext and determines who gets to use it

export async function apiClientFetch(url, { token, method = "GET", body } = []) {
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