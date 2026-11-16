import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../logic/api';

//this is a fallback 
//and is NEVER used inside the provider (where you intent to use it)
const WishListsContext = createContext(null);

export function WishListsContextProvider({ children }) {

    const [lists, setLists] = useState(null);
    const { username, token } = useAuth();

    const [error, setError] = useState(false);

    //force is a var to decide if the lists need to be reloaded.
    /*
    By default, it's set to FALSE, and the default object is also empty.
    This means that if we don't set force to TRUE and the lists state already
    has something in it, then we return the function without running the apiFetch again.
    This allows the context to work somewhat like a cache!
    */

    //resets lists when username changes (logout)
    useEffect(() => {
        setLists(null);
    }, [username]);

    async function loadLists({ force = false } = {}) {
        if (!token || (lists !== null && !force)) return;
        setError(null);
        try {
            setLists(await apiFetch(`/api/wishlists/mine`, { token: token }));
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
        <WishListsContext.Provider value={{ lists, loadLists, addList, removeList, loadBooksInList, addBookToList, removeBookFromList }}>
            {children}
        </WishListsContext.Provider>
    );
}

export const useWishLists = () => useContext(WishListsContext);