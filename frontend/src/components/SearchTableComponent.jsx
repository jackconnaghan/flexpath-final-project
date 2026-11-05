import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

export default function SearchTableComponent({ response }) {

    const [modal, setModal] = useState(false);
    const dataAreas = [
        "Title",
        "Author",
        "Publication Year",
        "ISBN-13",
        "Pages"
    ];

    function handleSendToReview(e, item) {

        fetchData("")

    }

    function openModal(e) {
        setModal(false);
    }

    /*
    Need a function to pass a book's information to the BookInfoModalComponent
    */

    return (
        <div>
            {/* <ErrorBoundary>
                <a href="#terms" onClick={(e) => openModal(e)} >
                    Practice Modal
                </a>
                {modal && <h4>hello</h4>}
            </ErrorBoundary> */}

            <table className="table container-fluid px-0 table-striped w-100%">

                <thead>
                    <tr>
                        {dataAreas.map((item, key) => (
                            <th scope="col" key={key}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(response?.length > 0) && (
                        response.map(item => (
                            //pass the iterator at the top level
                            <tr className="col" key={item["title"]}>

                                <td>{item["title"]}</td>
                                <td>{item["author"]}</td>
                                <td>{item["pub_year"]}</td>
                                <td>{item["isbn13"]}</td>
                                <td>{item["pages"]}</td>

                                {/* <td>
                                    <button type="link" className="col" onClick={(e) => {
                                        handleSendToReview(e, item);
                                    }}>Write a Review</button>
                                </td> */}
                                <td>
                                    <button type="link" className="col" onClick={(e) => {
                                        handleAddToWishlist(e, item);}}>
                                            Add to List
                                        </button>
                                </td>

                            </tr>


                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

SearchTableComponent.propTypes = {
    response: PropTypes.arrayOf(PropTypes.object)
};