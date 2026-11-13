//checked for external dependencies
import React from "react";
import { useState, useDeferredValue } from "react";
import SearchFormComponent from "./SearchFormComponent";
import useFetch from "../hooks/useFetch";
import TextResponseComponent from "./SearchTextResponseComponent";
import FasterLogo from "../../public/FasterLoadingGif.gif";
import ErrorBoundary from "./ErrorBoundary";


//I plan to update this to a Tanstack Form later
export default function AddBookComponent() {

    const { fetchData: fetchDataCreateBook, setResponse, response, loading, error, statusCode } = useFetch();
    const [newBook, setNewBook] = useState(null);

    const [titleInput, setTitleInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");
    const [isbnInput, setIsbnInput] = useState();
    const [pubYearInput, setPubYearInput] = useState();
    const [pagesInput, setPagesInput] = useState();

    const method = "POST";

    async function handleSubmit(e) {
        e.preventDefault();
        // const xsrf = getCookie("XSRF-TOKEN");
        //grabbing keyword and filter and setting params
        //before sending off to useFetch
        const sendingBook = {
            title: titleInput,
            author: authorInput,
            pub_year: pubYearInput,
            isbn_13: isbnInput,
            pages: pagesInput
        }

        const baseURL = `/api/books/create`;

        console.log(`base: ${baseURL}`);
        setNewBook(fetchDataCreateBook(baseURL, sendingBook, method));
        //setInput("");
    }

    function determineStatusCodeError(status) {

        switch (status) {
            case 201: return "Good to go!";
            case 409: return "Book already exists in the database, schlorpgling."
            default: return "Not good!";
        }
    }

    return (
        <div className="top row align-add-book-items ">

            <div className="col search-page-inputs container">
                <form className="col" onSubmit={(e) => {
                    handleSubmit(e);

                }}>
                    <div className="row">
                        <p className="col"><strong>Title</strong>{!titleInput &&
                            <small className="text-warn" > (every book needs a title, zorpling)</small>}</p>

                    </div>
                    <input className="form-control w-50 custom-input" type="text" placeholder="title..."
                        value={titleInput}
                        //this does not work without the brackets, 
                        //as React will not prioritize the onChange event
                        //and will cache it for async
                        onChange={(e) => {
                            setTitleInput(e.target.value)
                        }

                        }></input>
                    <br></br>
                    <p><strong>Author</strong></p>
                    <input className="form-control w-50 custom-input" type="text" placeholder="author..."
                        value={authorInput}
                        onChange={(e) => {
                            setAuthorInput(e.target.value)
                        }}>

                    </input>
                    <br></br>
                    <p><strong>Publication Year</strong></p>
                    <input className="form-control w-50 custom-input" type="text" placeholder="year published..."
                        value={pubYearInput}
                        onChange={(e) => {
                            setPubYearInput(e.target.value)
                        }}>
                    </input>
                    <br></br>
                    <p><strong>ISBN-13</strong></p>
                    <input className="form-control w-50 custom-input" type="text" placeholder="isbn..."
                        value={isbnInput}
                        onChange={(e) => {
                            setIsbnInput(e.target.value)
                        }}>
                    </input>
                    <br></br>
                    <p><strong>Number of Pages</strong></p>
                    <input className="form-control w-50 custom-input" type="text" placeholder="pages..."
                        value={pagesInput}
                        onChange={(e) => {
                            setPagesInput(e.target.value)
                        }}>
                    </input>

                    <button type="submit" disabled={!titleInput} className="btn btn-primary sexy-btn">Submit</button>

                </form>

            </div>
            <ErrorBoundary error={error}>
                <TextResponseComponent response={response} loading={loading} error={error} status={statusCode} />
            </ErrorBoundary>

            <div className="col">
                {loading && <h3>Adding yo book cuh...</h3>}
                {!loading && statusCode && statusCode !== 201 && (
                    <div>
                        <h3>Error with status code {statusCode}: {determineStatusCodeError(statusCode)}</h3>
                        {/* <h3>{error}</h3> */}
                    </div>

                )}
                {!loading && !error && response?.id && (
                    <div className="text-left align-center">
                        <h3>Good to go!</h3>
                        <table>
                            <tbody>
                                <tr><th>Title:</th><td>{response.title}</td></tr>
                                <tr><th>Author:</th><td>{response.author}</td></tr>
                                <tr><th>Year Published:</th><td>{response.pub_year}</td></tr>
                                <tr><th>ISBN-13:</th><td>{response.isbn13}</td></tr>
                                <tr><th>Pages:</th><td>{response.pages}</td></tr>
                            </tbody>
                        </table>

                        <button type="button">Write a review</button>
                    </div>
                )}
            </div>
            {!loading && !response && <h3 className="text-center">Enter a book in the inputs above</h3>}

        </div>



    )
}