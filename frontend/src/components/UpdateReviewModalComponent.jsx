//checked for external dependencies imports
import React, { useState, useEffect } from "react";
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from "@mui/material/Typography";
import useFetch from "../hooks/useFetch";
import { useAuthStore } from "../stores/authorizationStore";
import { useWishListStore } from "../stores/useWishListStore";
// import { useForm } from "@tanstack/react-form";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";
// import Select from "@mui/material/Select";

export default function UpdateReviewModalComponent({ setLocalError, book_id, openModal, closeModal, review_id, review_text, create, update, remove }) {

    const { userLists } = useWishListStore();
    //const [error, setError] = useState(null);

    //grab username and then establish array of lists based on username
    const username = useAuthStore((s) => s.user.username);

    const { fetchData, response, loading, error, statusCode } = useFetch();

    const editReviewForm = useForm({
        defaultValues: {
            bookId: book_id,
            reviewId: review_id,
            newReviewText: review_text ?? "",
            oldReviewText: review_text,
            starRating: 1,
        },
        //"value" is an object that contains all the defaultValues above (changes from default if a change occurs)
        //just remember that defaultValues = values, and value is one of the values
        onSubmit: async ({ value }) => {
            setLocalError(null);
            try {
                if (review_id) {
                    await update(book_id, review_id, value.reviewText.trim());
                } else {
                    await create(book_id, value.reviewText.trim());
                }
                closeModal();                      // only reached if the request succeeded
            } catch (err) {
                setLocalError(err.message);             // apiFetch throws, so this catches real failures
            }
        }
    });

    async function handleDelete() {
        setLocalError(null);
        try {
            await remove(book_id, review_id);
            closeModal();
        } catch (err) {
            setLocalError(err.message);
        }
    }

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
        alignItems: `center`,
    };

    return (

        <Modal open={openModal}
            onClose={closeModal}>
            <Box sx={modalStyle}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Update Review...
                </Typography>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editReviewForm.handleSubmit();

                    }}>

                    <editReviewForm.Field name="newReviewText">
                        {(field) =>
                            <label>
                                <textarea
                                    rows={5}
                                    cols={40}
                                    value={field.state.value}

                                    //handleChange is built into tanstack forms,
                                    //acts as an unseen state setter
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Write your review here...">
                                </textarea>
                            </label>}
                    </editReviewForm.Field>

                    {/* 
                    This has to be outside of the tanstackForm, otherwise it will read as a function of the Field tag.
                    Put it in its own Subscribe tag.
                    The Subscribe tag just watches the value of a particular state
                    and updates accordingly,
                    sorta like writing (bool ? ... : ...) but within the Tanstack Forms stack 
                    */}
                    <button type="submit">{review_id ? "UPDATE" : "CREATE"}</button>

                    {review_id && <button type="button" onClick={handleDelete}>DELETE</button>}

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

// handleReviewChange(book.id, book.review_id, book.review_text)

