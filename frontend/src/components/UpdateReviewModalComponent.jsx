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

export default function UpdateReviewModalComponent({ selectedRow, book_id, openModal, closeModal, review_id, review_text, create, update, remove, is_public }) {

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
    const [isPublic, setIsPublic] = useState(is_public ?? false);

    const { updateReviewText, createReview, deleteReview } = useReviews();
    const { setBookReview } = useWishLists();

    const ref = useRef();

    useEffect(() => {
        ref.current?.showModal();
        setText(review_text);
        // setIsPublic(is_public);
    }, []);

    async function handleSubmit() {
        setError(null);
        setLoading(false);
        try {
            if (review_id) {
                await updateReviewText(review_id, text, isPublic);
                setBookReview(book_id, { review_id, review_text: text, isPublic });
            } else {
                const created = await createReview(book_id, text, is_public);
                setBookReview(book_id, { review_id: created.id, review_text: created.review_text, is_public: created.is_public });
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

    return (

        <dialog ref={ref}
            onClose={closeModal}>
            <div className="row align-items-center">
                <p className="col">{review_id ? "Update Review..." : "Write a New Review..."}</p>
                <button className="col-3" type="button" onClick={() => closeModal()}>Close</button>
            </div>

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
                
                <label className="row">
                    <p className="col-auto">Is Public</p>
                    <input className="col-1" type="checkbox"
                        checked={isPublic}
                        onChange={(e) => {
                            setIsPublic(e.target.checked);
                        }}></input>
                </label>
                <div className="row">
                    <button className="col-3" type="submit">{review_id ? "UPDATE" : "CREATE"}</button>

                    {review_id && <button className="col-3" type="button" onClick={handleDelete}>DELETE</button>}
                </div>
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

