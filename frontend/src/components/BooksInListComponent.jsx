//checked for external dependencies 
import React, { useState, useEffect } from "react";

export default function BooksInListComponent({ user, list }) {

    const dataAreas = [
        "Title",
        "Author",
        "Publication Year",
        "ISBN-13",
        "Pages"
    ];
    return (
        <>

            <table>
                <thead>{list["title"]}</thead>
                <tbody>
                    {(list?.length > 0) && (
                        list.map(item => (
                            //pass the iterator at the top level
                            <tr className="col" key={item["title"]}>
                                <td>{item["title"]}</td>
                                <td>{item["author"]}</td>
                                <td>{item["pub_year"]}</td>
                                <td>{item["isbn13"]}</td>
                                <td>{item["pages"]}</td>
                            </tr>)
                        )
                    )}
                </tbody>
            </table>
        </>);
}

{/* <td>
                                    <button type="link" className="col" onClick={(e) => {
                                        handleSendToReview(e, item);
                                    }}>Write a Review</button>
                                </td> */}
{/* <td>
                                <button type="link" className="col" onClick={(e) => {
                                    handleAddToWishlist(e, item);
                                }}>
                                    Add to List
                                </button>
                            </td> */}