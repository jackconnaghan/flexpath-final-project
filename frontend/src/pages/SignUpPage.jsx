import React, { useState } from "react";
import BookSearchComponent from "../components/BookSearchComponent";
import "../../styles.css";
import ErrorBoundary from "../components/ErrorBoundary";
// import LoginFormComponent from "../components/LoginFormComponent";
import SignUpFormComponent from "../components/SignUpFormComponent";


function SignUpPage() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="extend-under-navbar search-just">
            <h1 className="m-5">SIGN UP!</h1>
            <SignUpFormComponent />
        </div>
    );
}

export default SignUpPage;