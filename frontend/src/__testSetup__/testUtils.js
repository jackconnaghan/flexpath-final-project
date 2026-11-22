//I'll be honest I had to look basically all of this up

/*
This makes a token,
logs a user in with the token and username,
renders the UI under the AuthContextProvider,
and fakes a response
*/

// Shared helpers so each test doesn't repeat the same setup.
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContextProvider } from "../contexts/AuthContext";

//Makes fake JWT (same way the real backend does)
export function makeToken(payload) {
  const toBase64Url = (obj) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${toBase64Url({ alg: "HS256" })}.${toBase64Url(payload)}.fake-signature`;
}

// Pretend a user is already logged in. AuthContext's useState reads
// sessionStorage on startup, so setting it BEFORE render is enough.
// Otherwise matches keys for the header (token, username)
export function logInAs(username, authorities = ["USER"]) {
  sessionStorage.setItem("token", makeToken({ sub: username, authorities }));
  sessionStorage.setItem("username", username);
}

// Renders a component inside the same providers the real app has.
// `route` sets the starting URL, e.g. "/search?title=dune".
export function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContextProvider>{ui}</AuthContextProvider>
    </MemoryRouter>
  );
}

// A fake fetch Response, matching only the parts apiFetch reads.
export function fakeResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}
