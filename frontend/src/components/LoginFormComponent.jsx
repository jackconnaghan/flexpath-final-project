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

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function LoginFormComponent({ onSearch, loading }) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const { login, logout } = useAuth();

    async function handleSubmit(username, password) {
        await login(username, password);
    }

    return (
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
                    type="text"
                    placeholder="password"
                    value={passwordInput}
                    onChange={(e) => {
                        setPasswordInput(e.target.value);
                    }} />
            </label>
            <button type="submit" disabled={!usernameInput && !passwordInput}>LOG IN</button>
        </form>
    )
}