// import { getCookie } from "./getCookie";

// //da client name (you see it everywhere)
// const registrationId = "book-review-client";

// //function to log in
// export function login(returnTo = window.location.pathname) {
//     //use the returnTo object to remember where we were
//     try {
//         sessionStorage.setItem("returnTo", returnTo);
//     } catch {

//     };
//     window.location.href = `/oauth2/authorization/${registrationId}`;
// }

// //logout a user by controlling form elements
// export function logout() {
//     //CSRF makes it so that a logout can only happen via 
//     //a POST request, so we make a quick form to make that happen
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "/logout";

//     const csrf = document.createElement("input");
//     csrf.type = "hidden";
//     csrf.name = "_csrf";                          // Spring's default CSRF form-field name
//     csrf.value = getCookie("XSRF-TOKEN") ?? "";
//     form.appendChild(csrf);

//     document.body.appendChild(form);
//     form.submit();
// }