import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";

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

    return (
        <table className="table container-fluid px-0 table-striped w-100%">
            <a href="#terms" onClick={openModal()} >
                Practice Modal
            </a>
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


                            <button type="link" className="col" onClick={(e) => {
                                handleSendToReview(e, item);
                            }}>Add to Reading List</button>
                        </tr>


                    ))
                )}
            </tbody>
        </table>
    );
}

SearchTableComponent.propTypes = {
    response: PropTypes.arrayOf(PropTypes.object)
};