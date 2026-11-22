import { screen, fireEvent } from "@testing-library/react";
import { useAuth } from "../contexts/AuthContext"; // adjust path
import { renderWithProviders, makeToken, logInAs, fakeResponse } from "../__testSetup__/testUtils";

function AuthProbe() {
    const { username, roles, isLoggedIn, login, logout } = useAuth();
    return (
        <div>
            <p>logged in: {String(isLoggedIn)}</p>
            <p>user: {username ?? "none"}</p>
            <p>roles: {roles.join(",") || "none"}</p>
            {/* Adjust to match your login() signature */}
            <button onClick={() => login("admin", "admin")}>do login</button>
            <button onClick={logout}>do logout</button>
        </div>
    );
}

describe("AuthContext", () => {
    test("starts logged out when sessionStorage is empty", () => {
        renderWithProviders(<AuthProbe />);

        // getByText throws if the text isn't found, so finding it is the assertion.
        // (toBeInTheDocument needs @testing-library/jest-dom, which isn't in the seed.)
        expect(screen.getByText("logged in: false")).toBeTruthy();
        expect(screen.getByText("roles: none")).toBeTruthy();
    });

    test("login updates state and saves to sessionStorage", async () => {
        const token = makeToken({ sub: "admin", authorities: ["USER"] });
        fetch.mockResolvedValue(fakeResponse(200, { accessToken: { token } }));
        renderWithProviders(<AuthProbe />);

        fireEvent.click(screen.getByRole("button", { name: "do login" }));

        //need to AWAIT as the fireEvent is async
        expect(await screen.findByText("logged in: true")).toBeTruthy();
        expect(screen.getByText("user: admin")).toBeTruthy();
        expect(screen.getByText("roles: USER")).toBeTruthy();
        expect(sessionStorage.getItem("username")).toBe("admin");
    });

    test("logout clears state and sessionStorage", () => {
        logInAs("jack");
        renderWithProviders(<AuthProbe />);

        fireEvent.click(screen.getByRole("button", { name: "do logout" }));

        expect(screen.getByText("logged in: false")).toBeTruthy();
        expect(sessionStorage.getItem("token")).toBeNull();
    });

    test("restores a session from sessionStorage on startup (page refresh)", () => {
        logInAs("admin", ["USER", "ADMIN"]);

        renderWithProviders(<AuthProbe />);

        expect(screen.getByText("user: admin")).toBeTruthy();
        expect(screen.getByText("roles: USER,ADMIN")).toBeTruthy();
    });
});
