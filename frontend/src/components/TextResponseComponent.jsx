import React from "react";
import kOnzy from "/kOnzy.gif";
import FasterLogo from "../../public/FASTERCompressedLogo.gif"


export default function TextResponseComponent({ response, loading, error }) {
    // {/* BE CAREFUL WITH && as it can return a 0 that just gets rendered for free
    // He gets in. He gets it done. He leaves. */}
    return (
        <div>
            {(loading && !error) &&
                <div className="text-centered" style={{ display: "flex" }}>
                    <h2 className="display-5 align-middle">Loading...</h2>
                    <div className="gif-load align-middle">
                        <img src={FasterLogo} className="gif-load align-middle"></img>
                    </div>
                </div>}
            {(!loading && response?.length > 0) &&
                <h2 className="display-5">Displaying {response?.length} records:</h2>
            }
            {(!loading && !error && response.length <= 0) &&
                <h2 className="display-5">No records to display</h2>
            }

            {(error) &&
                <div className="error-container">
                    <h2 className="">An error occurred:</h2>
                    <h2 className="error-text">{error}</h2>
                    <h4>{error.code}</h4>
                </div>
            }
        </div>
    )
}