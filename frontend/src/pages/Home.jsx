import React, { useState } from "react";
import "../../styles.css";

function Home() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="container extend-under-navbar">
            <h1 className="display-4 p-0">FlexPath Final Project
                <small className="display-6 text-muted" > (But Different...)</small>
            </h1>
            <p>Hello Ladies! :-)</p>
            <div className="row">
                <div className="col">
                    <h1 className="display-4 p-0">Development Page</h1>
                    
                    <a className="d-flex row" href="https://www.kaggle.com/datasets/valakhorasani/mobile-device-usage-and-user-behavior-dataset?resource=download"
                    >Sourced from this Kaggle Dataset</a>
                    <br></br>
                </div>
            </div>
        </div>
    );
}

export default Home;