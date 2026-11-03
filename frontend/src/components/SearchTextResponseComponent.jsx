import React from "react";
import kOnzy from "/kOnzy.gif";
import FasterLogo from "../../public/FASTERCompressedLogo.gif"


export default function SearchTextResponseComponent({ response, loading, error, status }) {
    // {/* BE CAREFUL WITH && as it can return a 0 that just gets rendered for free
    // He gets in. He gets it done. He leaves. */}
    return (
        <div className="my-3 mx-5">
            {(loading && !error) &&
                <div className="text-centered" style={{ display: "flex" }}>
                    <h2 className="display-5 align-middle">Loading...</h2>
                </div>}
            {(!loading && (response?.length > 0)) && (
                <div>
                    <h3 className="display-5">We found {response?.length} tomes that smell like that:</h3>
                    <h3>Status Code: {status}</h3>
                </div>
            )

            }
            {(!loading && !error && response.length <= 0) &&
                <h3 className="display-5">No filthy books to display...</h3>
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