import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

//handles what buttons show up in the navbar
//separate from RequireAuth, which handles details on pages/other comps
//I separated them mainly for styling purposes
export default function NavBarLoginPromptComponent({ children, location }) {
    const navigate = useNavigate();
    // const location = useLocation();
    const { isLoggedIn, username, logout } = useAuth();


    function navToLogin() {
        // setMenuVisible(false);
        navigate("/login", { state: { from: location } });
    }

    function navToSignUp() {
        // setMenuVisible(false);
        navigate("/sign-up"), { state: { from: location } };
    }

    // sends user back to home page after logout
    function handleLogout() {
        // setMenuVisible(false);
        logout();
        navigate("/");
    }

    if (isLoggedIn && username) {
        return (
            <>
                {children}
                <div className="row">
                    <span className="col-auto navbar-hello-text">Welcome, {username}</span>
                    <button type="button" className="col navbar-log-buttons" onClick={handleLogout}>Logout</button>
                </div>
            </>
        )
    }

    return (
        <>
            <button type="button" className="navbar-log-buttons" onClick={navToLogin}>Sign In</button>
            <button type="button" className="navbar-log-buttons" onClick={navToSignUp}>Sign Up</button>
        </>
    )
}