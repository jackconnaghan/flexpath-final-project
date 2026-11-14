//bones are from api.js
//
import { apiFetch } from "./api";

export async function loginUser(username, password) {
    //set up headers object
    const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { username, password },
    });
    return data.accessToken.token;
}

export async function signUpNewUser(username, password) {
    const data = await apiFetch("/api/users", {
        method: "POST",
        body: { username, password },
    });
    return data;
}


//a lot of the below is in apiClient.js, so I just
//removed it and made use of apiClient instead
// const headers = {};

// //if body has contents, set headers to JSON
// if (body !== undefined) headers["Content-Type"] = "application/json";
// // if (token) headers.Authorization = `Bearer ${token}`;

// //from here,
// //need one call to establish a username
// //and another call to establish that user's roles

// //here goes
// const response = await fetch(url, {
//     method,
//     //token body is in the header in Authorization, you JUST set that upstairs
//     headers,
//     body: body !== undefined ? JSON.stringify(body) : undefined,
// });

// //this doesn't actually attach the error to the response obj,
// //so there's no way to attach this error to the returns from useFetch
// //with the setError state setter.

// // if (!response.ok) {
// //     throw new Error(`Request failed with status ${response.status}`);
// // }

// //do this instead. It adds the err.status to response.status
// if (!response.ok) {
//     const problem = await response.json().catch(() => null);
//     const err = new Error(problem?.detail || `Request failed with status ${response.status}`);
//     err.status = response.status;      // without this, the hook has no status to save
//     throw err;
// }

// return response.status === 204 ? null : response.json();

//no logout function needed; token gets lost when sessionStorage gets updated

// Example of writing to storage

// window.sessionStorage.setItem("key", "value");
// To retrieve item from storage use

// window.sessionStorage.getItem("key");