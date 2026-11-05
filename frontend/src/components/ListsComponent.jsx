import React, { useState } from "react";
import RequireAuth from "./RequireAuth";
// import keycloak from "../keycloak";
import { useAuthStore, syncAuthFromKeycloak } from "../stores/authorizationStore";
import useFetch from "../hooks/useFetch";

export default function ListsComponent({user, response}) {
    // const status = useAuthStore((s) => s.status);
    // const user = useAuthStore((s) => s.user);

    // const { fetchSearchData, setResponse, response, loading, error, statusCode } = useFetch();

    return (
        <>
        <h4>Hello, {user}</h4>
        <h4>Here are your lists...</h4>
        <table>
            <thead>Lists</thead>
            <tbody>
                {/* Stole this from the SearchTableComponent */}
                {(response?.length > 0) && (
                        response.map(item => (
                            //pass the iterator at the top level
                            <tr className="col" key={item["title"]}>

                                <td>{item["title"]}</td>
                                <td>{item["author"]}</td>
                                <td>{item["pub_year"]}</td>
                                <td>{item["isbn13"]}</td>
                                <td>{item["pages"]}</td>
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
        </>
    )
}