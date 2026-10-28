import React from "react";
import { useState, useDeferredValue } from "react";
import FormComponent from "../components/FormComponent";
import useFetch from "../hooks/useFetch";
import TextResponseComponent from "./TextResponseComponent";
import FasterLogo from "../../public/FasterLoadingGif.gif"

export default function AddBookComponent () {

    const { fetchData, setResponse, response, loading, error } = useFetch();
    const [newBook, setNewBook] = useState("");

    const method = "POST";


    const gothamKnights = {
        title: "Gotham Knights",
        author: "Dude McKnight",
        pub_year: "1998",
        isbn_13: "910209139019024129490104",
        pages: 91
    }

    async function handleSubmit(e) {
        e.preventDefault();
        //grabbing keyword and filter and setting params
        //before sending off to useFetch
        const sendingBook = {
            title: gothamKnights.title,
            author: gothamKnights.author,
            pub_year: gothamKnights.pub_year,
            isbn_13: gothamKnights.isbn_13,
            pages: gothamKnights.pages
        }

        const baseURL = `/api/books/create`;

        console.log(`base: ${baseURL}`);
        fetchData(baseURL, sendingBook, method);
        //setInput("");
    }
    function addGothamKnights () {
            // useFetch("http://localhost:8090/api/", ...gothamKnights);
        
    }

    return (
        <div className="top">
            <p>Use the form below to add a book to the database.</p>
            {/* <FormComponent /> */}
            
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <button type="submit" className="btn silly-button btn-primary">Click me to add a book!</button>
            </form>
            <TextResponseComponent response={response} loading={loading} error={error}/>
            <p value={newBook}>{newBook ? newBook : "No Book here!"}</p>
        </div>
    )
}