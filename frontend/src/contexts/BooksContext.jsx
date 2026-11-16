import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../logic/api';
import { useSearchParams } from 'react-router-dom';

//this is a fallback 
//and is NEVER used inside the provider (where you intent to use it)
const BooksContext = createContext(null);

//acts as context for books in the Search For Books Page.
//Also holds reviews for those books
export function BooksContextProvider({ children }) {

    // const [lists, setLists] = useState(null);
    const [books, setBooks] = useState(null);
    const { username, token } = useAuth()
    //context state for refilling search params
    const [lastQuery, setLastQuery] = useState(null);
    const [results, setResults] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();


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
        setBooks(null);
    }, [username]);

    //steals a lot from the WishListContext 

    //this is new
    //takes a string containing the query from the url and checks it against the context query 
    //instead of holding 
    async function searchBooks(query) {
        //if query is equal to the lastQuery AND results is NOT null, quit out
        if (query === lastQuery && results !== null) return;
        //otherwise,
        setError(null);
        setLoading(false);
        try {
            //make call with search queries
            const response = await apiFetch(`/api/books/search?${query}`);
            //set the response equal to results
            setResults(response);
            //...then CACHE (store in state) the query so it can be referenced later
            setLastQuery(query);
        } catch (err) {
            setError(err);
        }
    }

    async function onSearch({ title, author }) {
        //grabbing keyword and filter and setting params before sending off to useFetch

        // const params = new URLSearchParams();
        // (title.trim()) ? params.set("title", title.trim()) : params.set("title", "");
        // (author.trim()) ? params.set("author", author.trim()) : params.set("author", "");
        setSearchParams({ title: title.trim(), author: author.trim() })
        //this sets off a cascade of updates

        //the below fetch gets replaced with a useEffect that checks the URLSearchParams
        //and automatically loads books that match those params
        // fetchSearchData(`/api/books/search?${params}`, "GET");

        //console.log(`base: ${baseURL}`);
    }

    //currently breaks the add book page
    async function addBook(book) {
        setError(null);
        setLoading(true);
        try {
            const response = await apiFetch(`/api/books/create`, {
                token,
                method: "POST",
                body: book
            });
            setLastQuery(null);
            setResults(null);
            return response;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }






    async function loadBooks({ force = false } = {}) {
        if (!token || (books !== null && !force)) return;
        setError(null);
        try {
            setBooks(await apiFetch(`/api/wishlists/mine`, { token: token }));
        } catch (err) {
            setError(err.message);
        }
    }

    //this is where the database gets updated, too
    async function addList(wishlist_title) {
        setError(null);
        try {
            const data = await apiFetch(`/api/wishlists/create`,
                {
                    //token direct from the useAuth context provider, 
                    //no need to pass it in as addList(token)
                    token,
                    method: "POST",
                    body: { list_title: wishlist_title },
                }
            );
            //stole this from the former 
            /*
            Functional Update
            Explanation from Claude:
            A value: setLists(newArray) means “the state is now this.”

            A function: setLists(prev => ...) means “React, call this 
            function with the current state, and use whatever it returns 
            as the new state.”   

            "prev" represents the state of lists before the setList call is made
            */
            setLists(prev => [...(prev ?? []), data]);
            //?? [] prevents crash when lists is null/undefined (not yet loaded)
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function removeList(wishlist_id) {
        setError(null);
        try {
            const data = await apiFetch(`/api/wishlists/${wishlist_id}`,
                {
                    token,
                    method: "DELETE",
                }
            );
            //stole this from the former 
            /*
            Functional Update
            Explanation from Claude:
            A value: setLists(newArray) means “the state is now this.”

            A function: setLists(prev => ...) means “React, call this 
            function with the current state, and use whatever it returns 
            as the new state.”   

            "prev" represents the state of lists before the setList call is made
            */
            //this will reform the lists state based on a filter of the previous list
            setLists(prev => (prev ?? []).filter(list => list.id !== wishlist_id));
            //?? [] prevents crash when lists is null/undefined (not yet loaded)
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function loadBooksInList(wishlist_id, { force = false } = {}) {
        //wishlist_id will arrive as a string, since ListDetailPage pulls it from the URL
        //FUCK i got extreemly tripped up on that
        const id = Number(wishlist_id);
        /* 
        This says:
        create variable "existingList" which is equal to a list (if lists exists)
        where the list.id is equal to the wishlist_id passed as a param
        */
        const existingList = lists?.find(list => list.id === id)
        //ooks are already cached, dont call again
        if (!token || (existingList?.books && !force)) return;
        setError(null);
        try {
            const books = await apiFetch(`/api/wishlists/list/${wishlist_id}`, {
                token,
                method: "GET",
            })
            setLists(prev => (prev ?? [])
                //use some property shorthand to name the field after the variable "books"
                .map(list =>
                    list.id === id ? { ...list, books } : list

                ));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function addBookToList(wishlist_id, book_id) {
        const id = Number(wishlist_id);
        setError(null);
        try {
            const data = await apiFetch(`/api/wishlists/list/${wishlist_id}/add`,
                {
                    token,
                    method: "POST",
                    body: book_id,
                }
            );
            //sets list to a new state where 
            /*
            1. Map through lists, find list with matching id
            2. If list has matching id AND list has a books param,
            3. set the list obj equal to
                ...list, (everything already in list),
                PLUS, replace the books param with
                everything already in list.books plus the new book obj

                it's FUCKED up and I had to ask claude a lot of questions to iron it out but it works
            */
            // setLists(prev => (prev ?? [])
            //     .map(list => list.id === id && list.books
            //         //checks if data is good, then adds to list.books
            //         //otherwise, list.books becomes undefined
            //         ? (data ? { ...list, books: [...list.books, data] } : { ...list, books: undefined })
            //         : list
            //     ));
            setLists(prev => (prev ?? [])
                .map(list =>
                    list.id === id
                        ? { ...list, books: undefined }
                        : list
                ));
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    // async function removeBookFromList(wishlist_id, book_id) {
    //     setError(null);
    //     try {
    //         const data = await apiFetch(`/api/wishlists/list/${wishlist_id}`,
    //             {
    //                 //token direct from the useAuth context provider, 
    //                 //no need to pass it in as addList(token)
    //                 token,
    //                 method: "DELETE",
    //                 //look here first for errors
    //                 //some controller methods expect an object,
    //                 //others expect a single variable
    //                 body: book_id,
    //             }
    //         );

    //         if (data !== 0) {
    //             setLists(prevLists => (prevLists ?? [])
    //                 .map((list) => (
    //                     list.id === wishlist_id
    //                         ? list.filter(book => book.id !== book_id)
    //                         : list
    //             )));
    //         }

    //         //?? [] prevents crash when lists is null/undefined (not yet loaded)
    //         return data;
    //     } catch (err) {
    //         setError(err.message);
    //         throw err;
    //     }
    // }
    async function removeBookFromList(wishlist_id, book_id) {

        //just get in the habit of making the wishlistId a number
        //everything on WishListPage deals with wishlistId through the url
        //which is always a string
        const id = Number(wishlist_id);
        setError(null);
        try {
            const deleted = await apiFetch(`/api/wishlists/list/${id}`, {
                token,
                method: "DELETE",
                body: book_id,
            });
            if (deleted !== 0) {
                setLists(prev => (prev ?? [])
                    .map(list =>
                        list.id === id && list.books
                            //this is so fucking sexy
                            //if list.id === id and list.books exists,
                            //make list equal to exist list
                            //BUT make books equal to list.books minus the book with the chosen id
                            ? { ...list, books: list.books.filter(book => book.id !== book_id) }
                            : list
                    ));
            }
            return deleted;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    return (
        <BooksContext.Provider value={{ results, loading, error, searchBooks, addBook, onSearch }}>
            {children}
        </BooksContext.Provider>
    );
}

export const useBooks = () => useContext(BooksContext);