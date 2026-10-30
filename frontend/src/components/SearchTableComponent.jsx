import React from "react";
import PropTypes from "prop-types";

export default function SearchTableComponent({ response }) {

    const dataAreas = [
        "Title",
        "Author",
        "Publication Year",
        "ISBN-13",
        "Pages"
    ];

    return (
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
                        <tr className="" key={item["title"]}>

                            <td>{item["title"]}</td>
                            <td>{item["author"]}</td>
                            <td>{item["pub_year"]}</td>
                            <td>{item["isbn13"]}</td>
                            <td>{item["pages"]}</td>

                            <button type="link">Add to Reading List</button>

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