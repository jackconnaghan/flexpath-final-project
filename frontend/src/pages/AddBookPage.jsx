import React, { useState } from "react";
import AddBookComponent from "../components/AddBookComponent";
import "../../styles.css";

function AddBookPage() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="container extend-under-navbar">
            <h1 className="display-4 p-0">Search our database of books...</h1>
            <div className="search-page-parent-div">
                <div className="search-page-child-div-comp">
                    <AddBookComponent />
                </div>
                <div className="search-page-child-div-side">
                    <h4>Hai</h4>
                </div>
            </div>


        </div>
    );
}

export default AddBookPage;