//checked for external dependencies 

import React from "react";
import kOnzy from "/kOnzy.gif";
import FasterLogo from "../../public/FASTERCompressedLogo.gif"


export default function AddTextResponseComponent({ response, loading, error, status }) {
    // {/* BE CAREFUL WITH && as it can return a 0 that just gets rendered for free
    // He gets in. He gets it done. He leaves. */}
    return (
        <div className="my-3 mx-5">
            {(loading && !error) &&
                <div className="text-centered" style={{ display: "flex" }}>
                    <h2 className="display-5 align-middle">Loading...</h2>
                </div>}
            {(!loading && (response)) && (
                <div>
                    <h3 className="display-5">You added THIS filthy book::</h3>
                    <tbody>
                        <tr>{response.title}</tr>
                        <tr>{response.author}</tr>
                        <tr>{response.pubYear}</tr>
                        <tr>{response.isbn13}</tr>
                        <tr>{response.pages}</tr>

                    </tbody>
                </div>
            )

            }
            {(!loading && !error && response.length <= 0) &&
                <h3 className="display-5">Add a book in the fields above. Books must have at least a title.</h3>
            }

            {(error) &&
                <div className="error-container">
                    <h2 className="">An error occurred:</h2>
                    <h2 className="error-text">{error}</h2>
                    <h4>{error.message}</h4>
                </div>
            }
        </div>
    )
}