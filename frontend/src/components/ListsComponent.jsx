//checked for external dependencies imports
import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { NavLink } from "react-router-dom";
import CreateNewWishListModal from "./CreateNewWishListModal";
import { useWishLists } from "../contexts/WishListsContext";
import { useAuth } from "../contexts/AuthContext";

export default function ListsComponent({ children }) {
    // const status = useAuthStore((s) => s.status);
    // const user = useAuthStore((s) => s.user);

    //const { fetchSearchData, setResponse } = useFetch();

    //const lists = useWishListStore((s) => s.userLists[user]);
    // const addList = useWishListStore((s) => s.addList);
    // const removeList = useWishListStore((s) => s.removeList);
    // const loadLists = useWishListStore((s) => s.loadLists);
    const { username } = useAuth();
    const { lists, loadLists, addList, removeList } = useWishLists();
    //REMEMBER: DON'T CALL ANYTHING BUT apiFetch. It will handle it.
    //Put that hair in a bun and handle it
    // const { error } = useFetch();

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (lists === null) loadLists();
    }, [lists])

    return (
        <div className="m-5">
            <h4>Hello, {username}</h4>
            <h1>Here be your lists...arr...</h1>
            <button type="button" 
            className="mb-2" onClick={() =>
                setModalOpen(true)
            }>Create a New List</button>
            <br></br>

            {(lists === null ? (
                <>
                    <h3>Loading lists...</h3>
                </>
            ) : lists?.length === 0 ? (
                <>
                    <h3>You don't have any lists. Create one with the button below.</h3>
                </>
            ) : (
                <table className="table w-auto table-striped">
                    <thead>
                    </thead>
                    <tbody>
                        {lists.map(list => (
                            //pass the iterator at the top level
                            <tr className="col" key={list.id}>
                                <td>
                                    <button type="button" onClick={() => (
                                        removeList(list.id)
                                    )}>Delete List</button>
                                </td>
                                <td>
                                    <NavLink to={`/my-lists/${list.id}/`}>
                                        {list.list_title}
                                    </NavLink></td>
                            </tr>


                        ))}
                    </tbody>
                </table >
            ))
            }

            {
                modalOpen &&
                <CreateNewWishListModal setModalOpen={setModalOpen} />
            }
        </div>
    )
}