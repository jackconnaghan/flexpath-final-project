import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../logic/api';
import { useSearchParams } from 'react-router-dom';

//this is a fallback 
//and is NEVER used inside the provider (where you intent to use it)
const ReviewsContext = createContext(null);

//acts as context for books in the Search For Books Page.
//Also holds reviews for those books
export function ReviewsContextProvider({ children }) {

    // const [lists, setLists] = useState(null);
    const [publicReviews, setPublicReviews] = useState({});
    const [personalReviews, setPersonalReviews] = useState(null);
    const { username, token } = useAuth()
    //context state for refilling search params
    const [lastQuery, setLastQuery] = useState(null);
    const [results, setResults] = useState(null);

    // const [searchParams, setSearchParams] = useSearchParams();


    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    //force is a var to decide if the lists need to be reloaded.
    /*
    By default, it's set to FALSE, and the default object is also empty.
    This means that if we don't set force to TRUE and the lists state already
    has something in it, then we return the function without running the apiFetch again.
    This allows the context to work somewhat like a cache!
    */

    //resets books when username changes (logout)
    useEffect(() => {
        setPersonalReviews(null);
    }, [username]);

    //steals a lot from the WishListContext 

    //this is new
    //takes a string containing the query from the url and checks it against the context query 
    //instead of holding 
    async function loadAllPublicReviewsForBook(book_id) {
        //if query is equal to the lastQuery AND results is NOT null, quit out
        //if (query === lastQuery && results !== null) return;
        //otherwise,
        if (publicReviews && publicReviews[book_id] !== undefined) return;
        setError(null);
        setLoading(false);
        try {
            //make call with search queries
            const reviews = await apiFetch(`/api/reviews/book/${book_id}`);
            //set the response equal to results
            setPublicReviews(prev => ({ ...prev, [book_id]: reviews }));
            //...then CACHE (store in state) the query so it can be referenced later
            // setLastQuery(book_id);
            return publicReviews[book_id];
        } catch (err) {
            setError(err);
        } finally { setLoading(false); }
    }

    async function loadAllPersonalReviews({ force = false } = {}) {
        if (!token || (personalReviews !== null && !force)) return;
        setError(null);
        setLoading(true);
        try {
            const reviews = await apiFetch("/api/reviews/mine", { token });
            setPersonalReviews(reviews);
            return reviews;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    function retrieveAllPersonalReviews() {
        return personalReviews;
    }

    // async function addBooksToReviews(personalReviews) {
    //     if (!personalReviews) return;
    //     setError(null);
    //     setLoading(false);
    //     try {
    //         const reviewsWithBookTitles = await apiFetch
    //     }
    // }

    function retrieveAllPublicReviewsForBook(book_id) {
        return publicReviews[book_id];
    }

    //used in UpdateReviewModalComponent
    //doesn't set context state, just keeps this logic local to other
    //review context variables and functions
    async function updateReviewText(review_id, new_review_text, is_public) {
        setError(null);
        setLoading(false);
        try {
            const response = await apiFetch(`/api/reviews/update/${review_id}`, {
                token,
                method: "PUT",
                body: { review_text: new_review_text, is_public: is_public }
            });
            setPersonalReviews(prev => prev?.map(review =>
                review.review_id === review_id
                    ? { ...review, review_text: new_review_text, is_public: is_public }
                    : review
            ) ?? prev);
            return response;
        } catch (err) {
            setError(err);
        }
    }



    async function createReview(book_id, new_review_text, is_public) {
        setError(null);
        setLoading(false);
        try {
            const response = await apiFetch(`/api/reviews/create`, {
                token,
                method: "POST",
                body: { book_id: book_id, review_text: new_review_text, is_public: is_public },
            });
            return response;
        } catch (err) {
            setError(err);
        }
    }

    async function deleteReview(review_id) {
        setError(null);
        setLoading(false);
        try {
            const response = await apiFetch(`/api/reviews/delete/${review_id}`, {
                token,
                method: "DELETE",
            });
            return response;
        } catch (err) {
            setError(err);
        }
    }




    // async function filterToUserReviews() {
    //     setError(null);
    //     setLoading(false);
    //     try {
    //         const response = await apiFetch(`/api/reviews/mine`, { token: token });

    //     } catch (err) {
    //         setError(err);
    //     }

    // }

    return (
        <ReviewsContext.Provider value={{ results, loading, error, publicReviews, loadAllPublicReviewsForBook, retrieveAllPublicReviewsForBook, updateReviewText, createReview, deleteReview, loadAllPersonalReviews, retrieveAllPersonalReviews, personalReviews }}>
            {children}
        </ReviewsContext.Provider>
    );
}

export const useReviews = () => useContext(ReviewsContext);