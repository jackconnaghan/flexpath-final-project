//checked for external dependencies 
import React, { useState, useEffect, useRef } from "react";
// import useFetch from "../hooks/useFetch";
//commenting stores for now until i can make them contexts
// import { useAuthStore } from "../stores/authorizationStore";
// import { useWishListStore } from "../stores/useWishListStore";
// import { useForm } from "@tanstack/react-form";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";
import { useWishLists } from "../contexts/WishListsContext";

export default function AddBookToWishListModalComponent({ setSelectedRow, selectedRow, openModal, closeModal }) {

    //one reference for each modal
    const ref = useRef();
    // const reviewRef = useRef();

    const [error, setError] = useState(null);
    const [selectedList, setSelectedList] = useState("");

    const { lists, loadLists, addBookToList } = useWishLists();

    const [okay, setOkay] = useState(false);

    async function handleSubmit() {
        setError(null);
        try {
            await addBookToList(selectedList, selectedRow.id);
            setOkay(true);
        } catch (err) {
            setError(err.status === 409 ? "That book is already in that list!" : err.message);
        }
    }

    // useEffect(() => {
    //     if (open) loadLists(username)
    // }, [open, username, loadLists])
    // useEffect(() => {
    //     if (!selectedRow) return;
    //     ref.current?.showModal();
    //     if (lists === null) loadLists();
    //     setSelectedList(selectedRow.id);
    // }, [selectedRow]);
    useEffect(() => {
        ref.current?.showModal();
        // reviewRef.current?.showModal();
        if (lists === null) loadLists();
    }, []);

    // function determineStatusCodeError(status) {

    //     console.log("status:", status, typeof status);
    //     switch (status) {
    //         case 201: return "Good to go!";
    //         case 409: return "Book already exists in that list, gorplading."
    //         default: return "Not good!";
    //     }
    // }

    //ensures we don't show something that doesn't exist
    if (!selectedRow) return null;

    return (

        <dialog
            ref={ref}
            // open={() => openModal()}
            onClose={() => closeModal()}>
            Which list would you like to add <strong>{selectedRow.title}</strong> to?
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>

                <label>
                    Lists:
                    <select
                        value={selectedList}


                        //a select tag's .value refers to teh value of the selected option
                        onChange={(e) => setSelectedList(e.target.value)}>
                        {/* <option value="" disabled selected hidden>-- Select an option --</option> */}
                        <option value="" disabled>Choose a list...</option>
                        {(lists ?? []).map((item) => {
                            return (<option key={item.id} value={item.id}>{item.list_title}</option>)
                        })}
                    </select>
                </label>
                <div className="row">
                    <button className="col-auto m-2" disabled={!selectedList} type="submit">Add to Selected List</button>
                    <button className="col-auto m-2" type="button" onClick={() => closeModal()}>Cancel</button>
                </div>
                <ErrorBoundary className="col" error={error}>
                <div>
                    {error && <p className="text-warn">{error}</p>}
                    {!error && okay && <p>Good to go!</p>}
                </div>
            </ErrorBoundary>

            </form>



            

        </dialog>
    );
}