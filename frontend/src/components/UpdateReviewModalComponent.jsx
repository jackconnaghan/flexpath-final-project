//checked for external dependencies imports
import React, { useState, useEffect, useRef } from "react";
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from "@mui/material/Typography";
import useFetch from "../hooks/useFetch";
// import { useAuthStore } from "../stores/authorizationStore";
// import { useWishListStore } from "../stores/useWishListStore";
// import { useForm } from "@tanstack/react-form";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";
// import Select from "@mui/material/Select";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../logic/api";
import { useReviews } from "../contexts/ReviewsContext";
import { useWishLists } from "../contexts/WishListsContext";

export default function UpdateReviewModalComponent({ selectedRow, book_id, openModal, closeModal, review_id, review_text, create, update, remove }) {

    // const { userLists } = useWishListStore();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    //grab username and then establish array of lists based on username
    // const username = useAuthStore((s) => s.user.username);
    const { username, token } = useAuth();

    // const { response, loading, error, statusCode } = useFetch();

    // const [oldReviewText, setOldReviewText] = useState("");
    //only need one, otherwise gets confusing and doesn't work and is CRINGE
    const [text, setText] = useState("");

    const { updateReviewText, createReview, deleteReview } = useReviews();
    const { setBookReview } = useWishLists();

    const ref = useRef();

    //const [review, setReview] = useState(null);

    // const editReviewForm = useForm({
    //     defaultValues: {
    //         bookId: book_id,
    //         reviewId: review_id,
    //         newReviewText: review_text ?? "",
    //         oldReviewText: review_text,
    //         starRating: 1,
    //     },
    //     //"value" is an object that contains all the defaultValues above (changes from default if a change occurs)
    //     //just remember that defaultValues = values, and value is one of the values
    //     onSubmit: async ({ value }) => {
    //         setLocalError(null);
    //         try {
    //             if (review_id) {
    //                 await update(book_id, review_id, value.reviewText.trim());
    //             } else {
    //                 await create(book_id, value.reviewText.trim());
    //             }
    //             closeModal();                      // only reached if the request succeeded
    //         } catch (err) {
    //             setLocalError(err.message);             // apiFetch throws, so this catches real failures
    //         }
    //     }
    // });

    useEffect(() => {
        ref.current?.showModal();
        setText(review_text);
    }, []);

    async function handleSubmit() {
        setError(null);
        setLoading(false);
        try {
            if (review_id) {
                await updateReviewText(review_id, text);
                setBookReview(book_id, { review_id, review_text: text });
            } else {
                const created = await createReview(book_id, text);
                setBookReview(book_id, { review_id: created.id, review_text: created.review_text });
            }
            closeModal();
        } catch (err) {
            setError(err.status === 409 ? "That book is already in that list!" : err.message);
        } finally {
            setLoading(false);
        }
    }


    async function handleDelete() {
        setError(null);
        try {
            await deleteReview(review_id);
            setBookReview(book_id, null);
            closeModal();
        } catch (err) {
            setError(err.message);
        }
    }

    // function determineStatusCodeError(status) {

    //     console.log("status:", status, typeof status);
    //     switch (status) {
    //         case 201: return "Good to go!";
    //         case 409: return "Book already exists in that list, gorplading."
    //         default: return "Not good!";
    //     }
    // }



    //ensures we don't show something that doesn't exist
    // if (!selectedRow) return null;

    return (

        <dialog ref={ref}
            onClose={closeModal}>
            <p>Update Review...</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();

                }}>


                <label>
                    <textarea
                        rows={5}
                        cols={40}
                        value={text}

                        //handleChange is built into tanstack forms,
                        //acts as an unseen state setter
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your review here...">
                    </textarea>
                </label>


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
                    {error && <p className="text-warn">{error}</p>}
                </div>
            </ErrorBoundary>


        </dialog>
    );
}

// handleReviewChange(book.id, book.review_id, book.review_text)

