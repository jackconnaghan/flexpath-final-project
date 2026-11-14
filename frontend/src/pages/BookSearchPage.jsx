import React, { useState } from "react";
import BookSearchComponent from "../components/BookSearchComponent";
import "../../styles.css";
import ErrorBoundary from "../components/ErrorBoundary";

function BookSearchPage() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="extend-under-navbar search-just">
            <h1 className="m-5">Search our database of earthling readlings here...</h1>
            <BookSearchComponent method="GET" />
        </div>
    );
}

export default BookSearchPage;