import React, { useState, useEffect } from "react";
// import { useAuthStore } from "../stores/authorizationStore";
import { useParams } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
// import { useWishListStore } from "../stores/useWishListStore";
import { apiFetch } from "../logic/api";
import ErrorBoundary from "../components/ErrorBoundary";
import { NavLink, Link } from "react-router-dom";
import UpdateReviewModalComponent from "../components/UpdateReviewModalComponent";
import { useWishLists } from "../contexts/WishListsContext";
import { useAuth } from "../contexts/AuthContext";

export default function ListDetailPage() {
    return (
        <div className="extend-under-navbar search-just">
            <RequireAuth role="USER">
                <ListDetails />
            </RequireAuth>
        </div>
    );
}

function ListDetails() {
    //without brackets,
    //this declaration would pull an object
    //containing every param, not just the listId
    //(which gets parsed as a String, even though its a digit)
    const { listId } = useParams();

    const { username } = useAuth();
    const { removeList, lists, loadLists, loadBooksInList, removeBookFromList,
    } = useWishLists();

    const [booksInList, setBooksInList] = useState(null);
    const [localError, setLocalError] = useState(null);
    // const [bookReviews, setBookReviews] = useState(null);

    const [reviewUpdateModalOpen, setReviewUpdateModalOpen] = useState(false);

    const [selectedBookId, setSelectedBookId] = useState(0);
    const [selectedReviewId, setSelectedReviewId] = useState(0);
    const [selectedReviewText, setSelectedReviewText] = useState("");

    //now that everything is imported and states are set...
    //extract the list locally from the context's lists obj
    const list = lists?.find(l => l.id === Number(listId));
    //..then extract the books from that list
    const books = list?.books;
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

    async function updateReview(book_id, review_id, new_review_text) {
        const answer = await apiFetch(`/api/reviews/update/${review_id}`,
            { method: "PUT", body: { review_text: new_review_text } });
        // setBooksInList((previousList) =>
        //     previousList.map((p) =>
        //         p.id === book_id ? { ...p, review_text: new_review_text } : p
        //     ));
        return answer;
    }

    async function createReview(book_id, review_text) {
        const answer = await apiFetch(`/api/reviews/create`, {
            method: "POST",
            //use star_rating because backend expects one SOMEwhere
            body: { book_id: book_id, review_text: review_text, star_rating: 1 },
        });
        // setBooksInList((previousList) =>
        //     previousList.map((p) =>
        //         p.id === book_id ? { ...p, review_id: answer.id, review_text: answer.review_text } : p
        //     )
        // );
        return answer;
    }

    useEffect(() => {
        if (lists === null) loadLists();
        else loadBooksInList(listId);
    }, [listId, lists]);

    // console.log(`list stuff:`, list);

    //books might be empty, which means map can't run.
    //need to place constraints to check if book is empty.
    //{booksInList?.length < 0}
    return (
        <>
            <button type="link">
                <Link to={`/my-lists`}>Back to My Lists</Link>
            </button>

            <h1>{list?.list_title}</h1>

            {books === undefined
                ? (<p>Loading books...</p>
                ) : books.length === 0
                    ? (<h3 className="text-warn">No books to show...</h3>
                    ) : (

                        <ErrorBoundary error={localError}>
                            {books?.length > 0 &&
                                <div className="extend-under-navbar">
                                    <h1>listId: {listId}</h1>
                                    <table className="table w-auto">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Title</th>
                                                <th>Author</th>
                                                <th>Your Review</th>
                                                <th></th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {books.map((book) => (
                                                <tr key={book.id}>

                                                    <td>
                                                        <button type="button" onClick={(e) => {
                                                            e.preventDefault();
                                                            removeBookFromList(listId, book.id);
                                                        }}>Remove From List</button>
                                                    </td>

                                                    <td>{book.title}</td>
                                                    <td>{book.author}</td>
                                                    <td>{book.review_text}</td>
                                                    <td>
                                                        {book.review_id ?
                                                            <button type="button" onClick={() => openReviewUpdateModal(book.id, book.review_id, book.review_text)}>Edit Review</button>
                                                            : <button type="button" onClick={() => openReviewCreateModal(book.id)}>Write a Review...</button>}
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
                    openModal={openReviewUpdateModal}
                    closeModal={closeReviewModal}
                    create={createReview}
                    update={updateReview}
                    remove={removeReviewFromBook} /> : null
            }
        </>

    )
}
