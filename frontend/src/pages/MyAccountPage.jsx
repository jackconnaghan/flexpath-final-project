import React, {useState, useEffect, useRef} from "react";
import { apiFetch } from "../logic/api";
import { useReviews } from "../contexts/ReviewsContext";
import { useParams } from "react-router-dom";
import { useWishLists } from "../contexts/WishListsContext";
import { useAuth } from "../contexts/AuthContext";
import UpdateReviewModalComponent from "../components/UpdateReviewModalComponent";
import ErrorBoundary from "../components/ErrorBoundary";

export default function MyAccountPage() {

    const { personalReviews, addBooksToReviews, retrieveAllPersonalReviews, loadAllPersonalReviews } = useReviews();

    const { username } = useAuth();

    const [localError, setLocalError] = useState(null);

    const [reviewUpdateModalOpen, setReviewUpdateModalOpen] = useState(false);

    const [selectedBookId, setSelectedBookId] = useState(0);
    const [selectedReviewId, setSelectedReviewId] = useState(0);
    const [selectedReviewText, setSelectedReviewText] = useState("");
    const [selectedReviewPublic, setSelectedReivewPublic] = useState(false);

    //now that everything is imported and states are set...
    //extract the list locally from the context's lists obj
    // const list = lists?.find(l => l.id === Number(listId));
    // //..then extract the books from that list
    // const books = list?.books;
    //thank me later

    function openReviewUpdateModal(book_id, review_id, review_text) {
        setSelectedBookId(book_id)
        setSelectedReviewId(review_id);
        setSelectedReviewText(review_text);
        setReviewUpdateModalOpen(true);
    }

    function closeReviewModal() {
        setReviewUpdateModalOpen(false);
    }

    function openReviewCreateModal(book_id) {
        setSelectedBookId(book_id)
        setSelectedReviewId(null);
        setSelectedReviewText("");
        setReviewUpdateModalOpen(true);
    }

    async function removeReviewFromBook(book_id, review_id) {
        const answer = await apiFetch(`/api/reviews/delete/${review_id}`, { method: "DELETE" });
        // setBooksInList((previousList) =>
        //     //maps through the previousList 
        //     previousList.map((p) =>
        //         //takes the id of the list and matches the book_id,
        //         //then copies everything in book BUT sets review_id and review_text to null
        //         p.id === book_id ? { ...p, review_id: null, review_text: null } : p
        //     ));
        return answer;
    }

    async function updateReview(book_id, review_id, new_review_text, is_public) {
        const answer = await apiFetch(`/api/reviews/update/${review_id}`,
            { method: "PUT", body: { review_text: new_review_text, is_public: is_public } });
        // setBooksInList((previousList) =>
        //     previousList.map((p) =>
        //         p.id === book_id ? { ...p, review_text: new_review_text } : p
        //     ));
        return answer;
    }

    async function createReview(book_id, review_text, is_public) {
        const answer = await apiFetch(`/api/reviews/create`, {
            method: "POST",
            //use star_rating because backend expects one SOMEwhere
            body: { book_id: book_id, review_text: review_text, star_rating: 1, is_public: is_public },
        });
        // setBooksInList((previousList) =>
        //     previousList.map((p) =>
        //         p.id === book_id ? { ...p, review_id: answer.id, review_text: answer.review_text } : p
        //     )
        // );
        return answer;
    }

    useEffect(() => {
        if (personalReviews === null) loadAllPersonalReviews();
        // retrieveAllPersonalReviews();
    }, [personalReviews]);

    // console.log(`list stuff:`, list);

    //books might be empty, which means map can't run.
    //need to place constraints to check if book is empty.
    //{booksInList?.length < 0}
    return (
        <div className="extend-under-navbar">
        <h1>MY ACCOUNT!!!</h1>
            {personalReviews === null
                ? (<p>Loading books...</p>
                ) : personalReviews.length === 0
                    ? (<h3 className="text-warn">No books to show...</h3>
                    ) : (

                        <ErrorBoundary error={localError}>
                            {personalReviews?.length > 0 &&
                                <div className="extend-under-navbar">
                                    
                                    <table className="table w-auto">
        <thead>
            <tr><th>Title</th><th>Author</th><th>Your Review</th><th>Visibility</th><th></th></tr>
        </thead>
        <tbody>
            {personalReviews.map(review => (
                <tr key={review.review_id}>
                    <td>{review.title}</td>
                    <td>{review.author}</td>
                    <td>{review.review_text}</td>
                    <td>{review.is_public ? "Public" : "Private"}</td>
                    <td>
                        <button type="button"
                            onClick={() => openReviewUpdateModal(review.book_id, review.review_id, review.review_text, review.is_public)}>
                            Edit Review
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
                                </div >}
                        </ErrorBoundary>
                    )}
            {reviewUpdateModalOpen ?
                <UpdateReviewModalComponent
                    //  handleReviewChange={handleReviewChange}
                    // setLocalError={setLocalError}
                    book_id={selectedBookId}
                    review_id={selectedReviewId}
                    review_text={selectedReviewText}
                    is_public={selectedReviewPublic}
                    openModal={openReviewUpdateModal}
                    closeModal={closeReviewModal}
                    create={createReview}
                    update={updateReview}
                    remove={removeReviewFromBook} /> : null
            }
            {/* <button type="button" onClick={apiFetch(
                `/api/users/${username}`, {
                method: "DELETE",
                body: null,
            }
            )}>DELETE ACCOUNT FOREVER!!!!</button> */}
            <button type="button">DELETE ACCOUNT FOREVER!!!</button>
            </div>
    )
}