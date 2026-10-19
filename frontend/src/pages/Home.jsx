import React, { useState } from "react";

function Development() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="container extend-under-navbar">
            <h1 className="display-4 p-0">User Behavior Dataset
                <small className="display-6 text-muted" > (But Different...)</small>
            </h1>
            <p>This dataset provides a comprehensive analysis of mobile device usage patterns and user behavior classification. It contains 700 samples of user data, including metrics such as app usage time, screen-on time, battery drain, and data consumption. Each entry is categorized into one of five user behavior classes, ranging from light to extreme usage, allowing for insightful analysis and modeling.</p>
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

export default Development;