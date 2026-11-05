import React, { useState } from "react";
import AddBookComponent from "../components/AddBookComponent";
import "../../styles.css";

function AddBookPage() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="extend-under-navbar search-just">
            <h1 className="m-5">Add to our collection of Earthling &quot;knowledge&quot;...</h1>
                    <AddBookComponent className="col-auto"/>
        </div>
    );
}

export default AddBookPage;