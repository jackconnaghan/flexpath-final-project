import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPromptComponent({ location }) {
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

    //sends user back to home page after logout
    // function handleLogout() {
    //     // setMenuVisible(false);
    //     logout();
    //     navigate("/");
    // }

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={navToLogin}>Sign In</button>
            <button type="button" className="btn btn-primary" onClick={navToSignUp}>Sign Up</button>
        </>
    )
}