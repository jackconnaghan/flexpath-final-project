import React, { useState, useEffect } from "react";
// import { useAuthStore } from "../stores/authorizationStore";
import { useParams } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
// import { useWishListStore } from "../stores/useWishListStore";
import { apiFetch } from "../logic/api";
import ErrorBoundary from "../components/ErrorBoundary";
import { NavLink, Link } from "react-router-dom";
import UpdateReviewModalComponent from "../components/UpdateReviewModalComponent";
export default function ListDetailPage() {
    return (
        <div className="extend-under-navbar search-just">
            <RequireAuth role="ROLE_USER">
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

    //pull username
    const username = useAuthStore((s) => s.user.username);

    //pull details of list
    const list = useWishListStore((s) =>
        //.find is javascript built-in,
        //useful for stores
        //find((l) ...) finds the first item in the array for which the test function is true
        //l (not 1, one) is the list/item in the array
        //loops through each item in the array until it finds one that passes the test
        s.userLists[username]?.find((l) => String(l.id) === listId)
    );

    const [booksInList, setBooksInList] = useState(null);
    const [localError, setLocalError] = useState(null);
    // const [bookReviews, setBookReviews] = useState(null);

    const [reviewUpdateModalOpen, setReviewUpdateModalOpen] = useState(false);

    const [selectedBookId, setSelectedBookId] = useState(0);
    const [selectedReviewId, setSelectedReviewId] = useState(0);
    const [selectedReviewText, setSelectedReviewText] = useState("");

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

    async function removeBookFromList(book_id, wishlist_id) {
        try {
            await apiFetch(`/api/wishlists/list/${listId}`, { method: "DELETE", body: book_id });
            setBooksInList((previousList) => previousList.filter((p) => p.id !== book_id));
        } catch (err) {
            setLocalError(err);
        }
    }

    async function removeReviewFromBook(book_id, review_id) {
        const answer = await apiFetch(`/api/reviews/delete/${review_id}`, { method: "DELETE" });
        setBooksInList((previousList) =>
            //maps through the previousList 
            previousList.map((p) =>
                //takes the id of the list and matches the book_id,
                //then copies everything in book BUT sets review_id and review_text to null
                p.id === book_id ? { ...p, review_id: null, review_text: null } : p
            ));
        return answer;
    }

    async function updateReview(book_id, review_id, new_review_text) {
        const answer = await apiFetch(`/api/reviews/update/${review_id}`,
            { method: "PUT", body: { review_text: new_review_text } });
        setBooksInList((previousList) =>
            previousList.map((p) =>
                p.id === book_id ? { ...p, review_text: new_review_text } : p
            ));
        return answer;
    }

    async function createReview(book_id, review_text) {
        const answer = await apiFetch(`/api/reviews/create`, {
            method: "POST",
            //use star_rating because backend expects one SOMEwhere
            body: { book_id: book_id, review_text: review_text, star_rating: 1 },
        });
        setBooksInList((previousList) =>
            previousList.map((p) =>
                p.id === book_id ? { ...p, review_id: answer.id, review_text: answer.review_text } : p
            )
        );
        return answer;
    }

    useEffect(() => {
        //similar to the AddToWishListComponent, 
        //cancelled is a tracking variable
        //that gets set to true as soon as the useEffect ends.
        //Since the apiFetch is async, 
        //if the component is unmounted before it finishes the call,
        //apiFetch returns undefined.
        //basically makes sure
        let cancelled = false;
        setBooksInList(null);
        setLocalError(null);

        //fetch data and put it in booksInList
        // try {
        //     const data = apiFetch(`/api/wishlists/list/${listId}`);
        //     if (cancelled != true) {
        //         setBooksInList(data);
        //     };
        // } catch (err) {
        //     if (cancelled != true) {
        //         setLocalError(err);
        //     }
        // }
        //same thing but in a thing.then.catch 
        apiFetch(`/api/wishlists/list/${listId}`)
            .then((data) => { if (cancelled != true) setBooksInList(data) })
            .catch((err) => {
                if (cancelled != true) setLocalError(err)
            }
            );

        return () => cancelled = true;
    }, [listId]);

    console.log(`list stuff:`, list);

    //books might be empty, which means map can't run.
    //need to place constraints to check if book is empty.
    //{booksInList?.length < 0}
    return (
        <>
            <button type="link">
                <Link to={`/my-lists`}>Back to My Lists</Link>
            </button>

            <h1>{list?.title}</h1>
            {booksInList <= 0 &&
                <h3 className="text-warn">No books to show...</h3>
            }
            {localError &&
                <h4 className="text-warn">Error: {localError.message}</h4>}
            <ErrorBoundary error={localError}>
                {booksInList?.length > 0 &&
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
                                {booksInList.map((book) => (
                                    <tr key={book.id}>

                                        <td>
                                            <button type="button" onClick={(e) => {
                                                e.preventDefault();
                                                removeBookFromList(book.id, listId);
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
            {reviewUpdateModalOpen ?
                <UpdateReviewModalComponent
                    //  handleReviewChange={handleReviewChange}
                    setLocalError={setLocalError}
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
