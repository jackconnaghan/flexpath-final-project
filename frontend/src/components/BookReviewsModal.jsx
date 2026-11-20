import React, { useState, useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch";
import ErrorBoundary from "./ErrorBoundary";
import TextResponseComponent from "./SearchTextResponseComponent";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../logic/api";
import { useReviews } from "../contexts/ReviewsContext";
import { useWishLists } from "../contexts/WishListsContext";

export default function BookReviewsModal({ selectedRow, closeModal }) {

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
    const [isPublic, setIsPublic] = useState(false);

    const { loadAllPublicReviewsForBook, publicReviews } = useReviews();
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
        // setText(review_text);
        // setIsPublic(is_public);
        loadAllPublicReviewsForBook(selectedRow.id);
    }, []);

    // async function handleSubmit() {
    //     setError(null);
    //     setLoading(false);
    //     try {
    //         if (review_id) {
    //             await updateReviewText(review_id, text, isPublic);
    //             setBookReview(book_id, { review_id, review_text: text, isPublic });
    //         } else {
    //             const created = await createReview(book_id, text, is_public);
    //             setBookReview(book_id, { review_id: created.id, review_text: created.review_text, is_public: created.is_public });
    //         }
    //         closeModal();
    //     } catch (err) {
    //         setError(err.status === 409 ? "That book is already in that list!" : err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }


    // async function handleDelete() {
    //     setError(null);
    //     try {
    //         await deleteReview(review_id);
    //         setBookReview(book_id, null);
    //         closeModal();
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // }

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

    //finally, set only this book's reviews from publicReviews
    const reviews = publicReviews[selectedRow.id];

    return (
        <div onClick={() => closeModal()}>

            <dialog ref={ref}
                onClose={closeModal}
                className="">
                <p>Reviews for <strong>{selectedRow.title}</strong></p>
                <p className="text-muted">Reviews you've made private won't appear here.</p>
                <button type="button" onClick={() => closeModal()}>Close</button>

                <table className="table container-fluid px-0 table-striped w-100%">

                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Review</th>
                            <th>Star Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews === undefined ? (
                            <tr><td colSpan={2}>Loading reviews…</td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={2}>No public reviews yet.</td></tr>
                        ) : (
                            reviews.map(review => (
                                <tr key={review.id}>
                                    <td>{review.username == username
                                        ? <p className="text-warn">Your Review</p>
                                        : <p>{review.username}</p>
                                    }</td>
                                    <td>{review.review_text}</td>
                                    <td>{review.star_rating}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>


                <ErrorBoundary error={error}>
                    <div>
                        {error && <p className="text-warn">{error}</p>}
                    </div>
                </ErrorBoundary>

                {/* <button type="button" onClick={() =>
                    openReviewModal
                }>Write A Review</button> */}
            </dialog>
        </div>
    );
}

// handleReviewChange(book.id, book.review_id, book.review_text)

