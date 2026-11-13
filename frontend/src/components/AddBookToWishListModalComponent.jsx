//checked for external dependencies 
import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
//commenting stores for now until i can make them contexts
import { useAuthStore } from "../stores/authorizationStore";
import { useWishListStore } from "../stores/useWishListStore";
// import { useForm } from "@tanstack/react-form";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";

export default function AddBookToWishListModalComponent({ setSelectedRow, selectedRow, modalStyle, open, openModal, closeModal }) {

    const { userLists } = useWishListStore();

    //grab username and then establish array of lists based on username
    const username = useAuthStore((s) => s.user.username);
    const listTitles = useWishListStore((s) => s.userLists[username])
    const loadLists = useWishListStore((s) => s.loadLists);

    useEffect(() => {
        if (open) loadLists(username)
    }, [open, username, loadLists])

    const { fetchData, response, loading, error, statusCode } = useFetch();

    const addBookToListForm = useForm({
        defaultValues: {
            selectedList: "",
        },
        //"value" is an object that contains all the defaultValues above (changes from default if a change occurs)
        //just remember that defaultValues = values, and value is one of the values
        onSubmit: async ({ value }) => {
            // onSearch(value);
            //book_id is captured before Modal mounts, comes from selectedRow
            const book_id = selectedRow.id;
            // const wishlist_id = value.selectedList;
            fetchData(`/api/wishlists/list/${value.selectedList}/add`,
                book_id, "POST");
        },
        //no validators, as button disables when no list is chosen
        //BUT
        //I ahve included a sample validator from Tanstack website for reference
        //     validators={{
        //     onChange: ({ value }) =>
        //         value < 13 ? 'You must be 13 to make an account' : undefined,
        // }}
    });

    function determineStatusCodeError(status) {

        console.log("status:", status, typeof status);
        switch (status) {
            case 201: return "Good to go!";
            case 409: return "Book already exists in that list, gorplading."
            default: return "Not good!";
        }
    }

    //ensures we don't show something that doesn't exist
    if (!selectedRow) return null;

    return (

        <Modal open={open}
            onClose={closeModal}>
            <Box sx={modalStyle}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Which list would you like to add <strong>{selectedRow.title}</strong> to?
                </Typography>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addBookToListForm.handleSubmit();
                    }}>

                    <addBookToListForm.Field name="selectedList">
                        {(field) =>
                            <label>
                                Lists:
                                <select
                                    value={field.state.value}

                                    //handleChange is built into tanstack forms,
                                    //acts as an unseen state setter
                                    onChange={(e) => field.handleChange(e.target.value)}>
                                    <option value="" disabled>Choose a list...</option>
                                    {(listTitles ?? []).map((item) => {
                                        return (<option key={item.id} value={item.id}>{item.list_title}</option>)
                                    })}
                                </select>
                            </label>}
                    </addBookToListForm.Field>

                    {/* 
                    This has to be outside of the tanstackForm, otherwise it will read as a function of the Field tag.
                    Put it in its own Subscribe tag.
                    The Subscribe tag just watches the value of a particular state
                    and updates accordingly,
                    sorta like writing (bool ? ... : ...) but within the Tanstack Forms stack 
                    */}
                    <addBookToListForm.Subscribe selector={(state) => state.values.selectedList}>
                        {(selectedList) => <button disabled={!selectedList}>Add to List</button>}
                    </addBookToListForm.Subscribe>

                </form>


                <ErrorBoundary error={error}>
                    <div>
                        {loading && <p>Loading...</p>}
                        {!loading && !error && response?.book_id && <p>Book added successfully!</p>}
                        {!loading && error && <p>Book could not be added: {determineStatusCodeError(statusCode)}</p>}
                    </div>
                </ErrorBoundary>

            </Box>

        </Modal>
    );
}