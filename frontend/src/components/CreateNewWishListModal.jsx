//checked for external dependencies imports
import React, { useState, useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch";
// import { useAuthStore } from "../stores/authorizationStore";
// import { useWishListStore } from "../stores/useWishListStore";
// import { useForm } from "@tanstack/react-form";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";
import { useWishLists } from "../contexts/WishListsContext";
import { useAuth } from "../contexts/AuthContext";
import { createPortal } from "react-dom";

export default function CreateNewWishListModal({ setModalOpen }) {

    const { lists, loadLists, addList, removeList } = useWishLists();
    const { username, token } = useAuth();
    // const { fetchData, response, loading, error, statusCode } = useFetch();

    const [newListName, setNewListName] = useState("");
    const [error, setError] = useState(null);

    const ref = useRef(null);

    function determineStatusCodeError(status) {

        console.log("status:", status, typeof status);
        switch (status) {
            case 201: return "Good to go!";
            case 409: return "Book already exists in that list, gorplading."
            default: return "Not good!";
        }
    }

    async function handleSubmit() {
        setError(null);
        try {
            await addList(newListName);
            setModalOpen(false);
        } catch (err) {
            setError(err.status === 409 ? "You already have a list with that name." : err.message);
        }
    }

    useEffect(() => {
        ref.current.showModal();
    }, [])

    //ensures we don't show something that doesn't exist
    // if (!selectedRow) return null;

    return (

        <dialog ref={ref} onClose={() => setModalOpen(false)}>

            Create a New List...
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>


                <label>
                    <input
                        value={newListName}

                        //handleChange is built into tanstack forms,
                        //acts as an unseen state setter
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Type a title...">
                    </input>
                </label>


                {/* 
                    This has to be outside of the tanstackForm, otherwise it will read as a function of the Field tag.
                    Put it in its own Subscribe tag.
                    The Subscribe tag just watches the value of a particular state
                    and updates accordingly,
                    sorta like writing (bool ? ... : ...) but within the Tanstack Forms stack 
                    */}
                <button type="submit" disabled={!newListName.trim()}>Add to List</button>
                <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>


            </form>
            {error === null && <p></p>}
            {error ? <p className="text-warn">{error}</p> : null}

            {/* <ErrorBoundary error={error}>
                <div>
                    {loading && <p>Loading...</p>}
                    {!loading && !error && response?.book_id && <p>Book added successfully!</p>}
                    {!loading && error && <p>Book could not be added: {determineStatusCodeError(statusCode)}</p>}
                </div>
            </ErrorBoundary> */}
        </dialog>
    );
}