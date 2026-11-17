//checked for external dependencies imports

//pulled from SearchFormComponent
import React from "react";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
// import { animated } from "@react-spring/web"
// import { useForm } from "@tanstack/react-form";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
// import { loginUser } from "../logic/apiAuthFetch";
import { useAuth } from "../contexts/AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import { useNavigate } from "react-router-dom";

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function SignUpFormComponent({ onSearch }) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    //these have their own error and loading state
    //because im tired
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, logout, signUp } = useAuth();

    //sends user back to home page after making an account
    const navigate  = useNavigate();

    async function handleSubmit(username, password) {
        setError(false);
        setLoading(true);
        try {
            await signUp(username, password);
            navigate("/");
        } catch (err) {
            setError(err.status === 409
                ? "We LITERALLY already have a user with that name..."
                : "Couldn't reach the server. Try again in a moment, porflimp.");
            setPasswordInput("");
            throw err;
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <h3>Create a new account...</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(usernameInput, passwordInput);
                }}>
                <label name="title">
                    <input className="form-control w-50"
                        type="text"
                        placeholder="username"
                        value={usernameInput}
                        onChange={(e) => {
                            setUsernameInput(e.target.value);
                        }} />
                </label>
                <label name="author">
                    <input className="form-control w-50"
                        type="password"
                        placeholder="password"
                        value={passwordInput}
                        required
                        minLength={(5)}
                        maxLength={(50)}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                        }} />
                </label>
                <button type="submit" disabled={!usernameInput && !passwordInput}>SIGN UP</button>
            </form>
            <ErrorBoundary error={error}>
                <p className="mt-3 text-warn">{error}</p>
            </ErrorBoundary>
        </>
    )
}