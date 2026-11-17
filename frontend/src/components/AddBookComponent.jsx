//checked for external dependencies
import React from "react";
import { useState, useDeferredValue } from "react";
import SearchFormComponent from "./SearchFormComponent";
import useFetch from "../hooks/useFetch";
import TextResponseComponent from "./SearchTextResponseComponent";
import FasterLogo from "../../public/FasterLoadingGif.gif";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../logic/api";
import { useBooks } from "../contexts/BooksContext";
import Book from "../../public/Book.png";
import UpdateReviewModalComponent from "../components/UpdateReviewModalComponent";


//I plan to update this to a Tanstack Form later
export default function AddBookComponent() {

    //pulling error locally like this means nothing
    //because calling it creates a new instance of the "error" object
    // const { error } = useFetch();
    //const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newBook, setNewBook] = useState(null);
    const { token } = useAuth();
    const { addBook } = useBooks();

    const [titleInput, setTitleInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");
    const [isbnInput, setIsbnInput] = useState("");
    const [pubYearInput, setPubYearInput] = useState("");
    const [pagesInput, setPagesInput] = useState("");

    //const method = "POST";

    //stuff to handle review updates
    // const [selectedRow, setSelectedRow] = useState();

    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewButton, setReviewButton] = useState(true);
    // const navigate = useNavigate();

    function openReviewModal(item) {
        // setSelectedRow(item);
        setReviewOpen(true);
    }
    function closeReviewModal() {
        // setSelectedRow(null);
        setReviewOpen(false);
        //navigate to the my account page
        setReviewButton(false);

    }

    async function handleSubmit() {
        //grabbing keyword and filter and setting params
        //before sending off to useFetch
        const sendingBook = {
            title: titleInput,
            author: authorInput,
            pub_year: Number(pubYearInput),
            isbn_13: Number(isbnInput),
            pages: Number(pagesInput)
        }

        const baseURL = `/api/books/create`;

        console.log(`base: ${baseURL}`);
        try {
            setError(null);
            setLoading(true);

            // setNewBook(await apiFetch(baseURL, { token, method: "POST", body: sendingBook }));
            const response = await addBook(sendingBook);
            console.log(`prev newBook: ${{ newBook }}`)
            setNewBook(response);
            // setNewBook(await addBook(sendingBook));
            console.log(`response: ${ response } `);
            console.log({ newBook });
        } catch (err) {
            setError(err.status === 409
                ? "We already have that book, schlorpling..."
                : err.message
            );
        } finally {
            setLoading(false);
        }
        //setInput("");
    }

    return (
        <div className="top row flex">


            {error && <p className="text-warn search-page-inputs">{error}</p>}
            <div className="col search-page-inputs">
                <h3 className="text-left">Enter a book in the inputs below.</h3>
                <form className="col" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();

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
                    <input className="form-control w-50 custom-input" type="number" placeholder="year published..."
                        value={pubYearInput}
                        onChange={(e) => {
                            setPubYearInput(e.target.value)
                        }}>
                    </input>
                    <br></br>
                    <p><strong>ISBN-13</strong></p>
                    <input className="form-control w-50 custom-input" type="number" placeholder="isbn..."
                        value={isbnInput}
                        onChange={(e) => {
                            setIsbnInput(e.target.value)
                        }}>
                    </input>
                    <br></br>
                    <p><strong>Number of Pages</strong></p>
                    <input className="form-control w-50 custom-input" type="number" placeholder="pages..."
                        value={pagesInput}
                        onChange={(e) => {
                            setPagesInput(e.target.value)
                        }}>
                    </input>

                    <button type="submit" disabled={!titleInput} className="btn btn-primary sexy-btn">Submit</button>

                </form>

            </div>
            {/* <ErrorBoundary error={error}>
                <TextResponseComponent response={response} loading={loading} error={error} status={statusCode} />
            </ErrorBoundary> */}

            <div className="col-md-6">
                {loading && <h3 className="">Adding yo book cuh...</h3>}
                {error && <h1>&lt;-- OOPS!!!</h1>}
                {!loading && !error && newBook?.id && (
                    <div>
                        {/* <pre>{JSON.stringify(newBook)}</pre> */}
                        <h3>Good to go!</h3>
                        <table className="table w-25">
                            <tbody>
                                <tr><th>Title:</th><td>{newBook.title}</td></tr>
                                <tr><th>Author:</th><td>{newBook.author}</td></tr>
                                <tr><th>Year Published:</th><td>{newBook.pub_year}</td></tr>
                                <tr><th>ISBN-13:</th><td>{newBook.isbn13}</td></tr>
                                <tr><th>Pages:</th><td>{newBook.pages}</td></tr>
                            </tbody>
                        </table>

                        {reviewButton &&
                            <button type="button" onClick={() => {
                                openReviewModal({

                                })
                            }
                            }>Write a review</button>
                        }
                    </div>
                )}


                <img src={Book} className="gif-load col-1 b-5" />
                {reviewOpen ?
                    <UpdateReviewModalComponent
                        //  handleReviewChange={handleReviewChange}
                        // setLocalError={setLocalError}
                        book_id={newBook.id}
                        openModal={openReviewModal}
                        closeModal={closeReviewModal} /> : null
                }
            </div>


        </div>


    )
}