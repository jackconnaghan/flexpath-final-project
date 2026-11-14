import React from "react";
import { apiFetch } from "../logic/api";

export default function MyAccountPage({ username }) {

    return (
        <>
        <button type="button" onClick={apiFetch(
            `/api/users/${username}`, {
                method: "DELETE",
                body: null,
            }
        )}>DELETE ACCOUNT FOREVER!!!!</button></>
    )
}