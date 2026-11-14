import React, { useState } from "react";
import BookSearchComponent from "../components/BookSearchComponent";
import "../../styles.css";
import ErrorBoundary from "../components/ErrorBoundary";
import LoginFormComponent from "../components/LoginFormComponent";
import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();
    const location = useLocation();

    //get the previous page
    const fromBefore = location.state?.from;
    const from = fromBefore ? location.state?.from?.pathname + (location.state?.from?.search || "") || "/" : "/";

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="extend-under-navbar search-just">
            <h1 className="m-5">LOG IN!</h1>
            <LoginFormComponent location={from} />
        </div>
    );
}

export default LoginPage;