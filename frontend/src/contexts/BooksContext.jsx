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
    
    return (
        <BooksContext.Provider value={{ results, loading, error, searchBooks, addBook, onSearch }}>
            {children}
        </BooksContext.Provider>
    );
}

export const useBooks = () => useContext(BooksContext);