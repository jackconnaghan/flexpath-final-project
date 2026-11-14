//checked for external dependencies imports

//pulled from SearchFormComponent
import React from "react";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
// import { loginUser } from "../logic/apiAuthFetch";
import { useAuth } from "../contexts/AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function LoginFormComponent({ location }) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    //these have their own error and loading because I think Super High School SUCKS
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login, logout } = useAuth();

    const navigate = useNavigate();

    async function handleSubmit(username, password) {
        setError(false);
        setLoading(true);
        try {
            await login(username, password);
            // useNavigate(location);
            //takes us back to the page we came from 
            navigate(location, {replace: true});
        } catch (err) {
            setError(err.status === 401
                ? "Hmmmm...we don't have that username and password combo...schlorp"
                : "Couldn't reach the server. Try again in a moment.");
            setPasswordInput("");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
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
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                        }} />
                </label>
                <button type="submit" disabled={!usernameInput || !passwordInput}>LOG IN</button>


            </form>
            {error &&
                <ErrorBoundary error={error}>
                    <h5>{error}</h5>
                </ErrorBoundary>
            }
        </div>
    )
}