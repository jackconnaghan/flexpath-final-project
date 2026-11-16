import React, { useState } from "react";
import BookSearchComponent from "../components/BookSearchComponent";
import "../../styles.css";
import ErrorBoundary from "../components/ErrorBoundary";
import Landed from "../../public/Landed.png";
import { useBooks } from "../contexts/BooksContext";
import FasterLogo from "../../public/FASTERCompressedLogo.gif";

function BookSearchPage() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    const { loading } = useBooks();

    return (
        <div className="extend-under-navbar search-just row">
            <h1 className="m-5 col">Search our database of earthling readlings here...</h1>
            <img src={loading ? FasterLogo : Landed} className="gif-load col-1 b-5" />

            <BookSearchComponent method="GET" />
        </div>
    );
}

export default BookSearchPage;