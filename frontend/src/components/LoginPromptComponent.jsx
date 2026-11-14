import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPromptComponent({ location, setMenuVisible }) {
    const navigate = useNavigate();
    // const location = useLocation();
    const { isLoggedIn, username, logout } = useAuth();


    function navToLogin() {
        setMenuVisible(false);
        navigate("/login", { state: { from: location } });
    }

    function navToSignUp() {
        setMenuVisible(false);
        navigate("/sign-up"), { state: { from: location } };
    }

    //sends user back to home page after logout
    function handleLogout() {
        setMenuVisible(false);
        logout();
        navigate("/");
    }



    if (isLoggedIn && username) {
        return (
            <div className="row container">
                <p className="col-auto">Welcome, {username}</p>
                <button type="button" className="col-auto h-500" onClick={handleLogout}>Logout</button>
            </div>
        )
    }

    return (
        <>
            <button type="button btn btn-primary" onClick={navToLogin}>Sign In</button>
            <button type="button btn btn-primary" onClick={navToSignUp}>Sign Up</button>
        </>
    )
}