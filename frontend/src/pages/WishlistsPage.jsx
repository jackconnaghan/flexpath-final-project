import React from "react";
import ListsComponent from "../components/ListsComponent";
import RequireAuth from "../components/RequireAuth";
import useFetch from "../hooks/useFetch";
import { useAuthStore, syncAuthFromKeycloak } from "../stores/authorizationStore";
import useCach

export default function WishListsPage() {

    //Host components related to wishlists
    //Host common props; setup context?

    const status = useAuthStore((s) => s.status);
    const user = useAuthStore((s) => s.user);

    const { fetchSearchData, setResponse, response, loading, error, statusCode } = useFetch();

    //gonna use cache on this one so the API request only gets called on the first 
    //load of the page
    const 

    return (
        <div className="extend-under-navbar search-just">
            <RequireAuth role="ROLE_USER">
                <h1 className="m-5">Here be your lists...</h1>
                <ListsComponent user={user.username} response={response} />
            </RequireAuth>

            {/* <RequireAuth role="ROLE_USER">
                <table>
                    <thead>

                    </thead>
                </table>
            </RequireAuth> */}

        </div>
    )
}