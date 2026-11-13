//checked for external dependencies imports
import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useAuthStore } from "../stores/authorizationStore";
import { useWishListStore } from "../stores/useWishListStore";
// import { useForm } from "@tanstack/react-form";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";
export default function CreateNewWishListModal({ setModalOpen }) {

    const { userLists } = useWishListStore();

    //grab username and then establish array of lists based on username
    const username = useAuthStore((s) => s.user.username);
    const listTitles = useWishListStore((s) => s.userLists[username])
    // const loadLists = useWishListStore((s) => s.loadLists);
    const addList = useWishListStore((s) => s.addList);

    // useEffect(() => {
    //     if (open) loadLists(username)
    // }, [open, username, loadLists])

    const { fetchData, response, loading, error, statusCode } = useFetch();

    const addBookToListForm = useForm({
        defaultValues: {
            newListName: "",
        },
        //"value" is an object that contains all the defaultValues above (changes from default if a change occurs)
        //just remember that defaultValues = values, and value is one of the values
        onSubmit: async ({ value }) => {
            // onSearch(value);
            //book_id is captured before Modal mounts, comes from selectedRow
            // const book_id = selectedRow.id;
            // const wishlist_id = value.selectedList;
            fetchData(`/api/wishlists/create/${value.newListName}`, null, "POST");
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
    // if (!selectedRow) return null;

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (

        <Modal open={open}
            onClose={setModalOpen}>
            <Box sx={modalStyle}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Create a New List...
                </Typography>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addBookToListForm.handleSubmit();
                        setModalOpen(false);
                    }}>

                    <addBookToListForm.Field name="newListName">
                        {(field) =>
                            <label>
                                Lists:
                                <input
                                    value={field.state.value}

                                    //handleChange is built into tanstack forms,
                                    //acts as an unseen state setter
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Type a title...">
                                </input>
                            </label>}
                    </addBookToListForm.Field>

                    {/* 
                    This has to be outside of the tanstackForm, otherwise it will read as a function of the Field tag.
                    Put it in its own Subscribe tag.
                    The Subscribe tag just watches the value of a particular state
                    and updates accordingly,
                    sorta like writing (bool ? ... : ...) but within the Tanstack Forms stack 
                    */}
                    <addBookToListForm.Subscribe selector={(state) => state.values.newListName}>
                        {(newListName) => <button disabled={!newListName}>Add to List</button>}
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