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
                    <h5 className="display-5 align-middle">Loading...</h5>
                </div>}
            {(!loading && (response?.length > 0)) && (
                <div>
                    <h5 className="display-5">We found {response?.length} tomes that smell like that:</h5>
                    {/* <h3>Status Code: {status}</h3> */}
                </div>
            )

            }
            {(!loading && !error && response?.length <= 0) &&
                <h5 className="display-5">No filthy books to display...</h5>
            }

            {(error) &&
                <div className="error-container">
                    <h5 className="text-warn">An error occurred:</h5>
                    <h5 className="error-text">{error}</h5>
                    <h5>{error.message}</h5>
                </div>
            }
        </div>
    )
}