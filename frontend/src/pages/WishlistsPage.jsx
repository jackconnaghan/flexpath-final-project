import React, { useEffect } from "react";
import ListsComponent from "../components/ListsComponent";
import RequireAuth from "../components/RequireAuth";
// import { useAuthStore } from "../stores/authorizationStore";
import useFetch from "../hooks/useFetch";
// import { useCache } from "../contexts/useCacheContext";
import { useState } from "react";
// import { useWishListStore } from "../stores/useWishListStore";
import { useWishLists } from "../contexts/WishListsContext";
import { useAuth } from "../contexts/AuthContext";
export default function WishListPage() {
    /*
According to Claude, a common crash in login-ready pages is when 
a username gets called before it's needed. If a user reached this page
without a username, then the old setup would have crashed due to 
username=null. The setup below allows the user to see the page without 
crashing, and will also prompt them to login if they are not.
    */
    return (
        <div className="extend-under-navbar search-just">
            <RequireAuth role="ROLE_USER">
                <MyWishListsSetup />
            </RequireAuth>
        </div>
    )
    //Calls MyWishListsSetup within the RequireAuth; common loop
}

function MyWishListsSetup() {

    //Host components related to wishlists
    //Host common props; setup context?

    //setting local state for caching a user's lists
    //sets the list of lists' username to the above
    // const lists = useWishListStore((s) => s.userLists[username]);
    // //captures setLists function (which turns response directly into userLists)
    // const setLists = useWishListStore((s) => s.setLists);
    // //loads lists to send to ListsComponent
    // const loadLists = useWishListStore((s) => s.loadLists);

    const { username } = useAuth();
    const { lists, loadLists, addList, removeList} = useWishLists();
    //REMEMBER: DON'T CALL ANYTHING BUT apiFetch. It will handle it.
    //Put that hair in a bun and handle it
    const { error } = useFetch();




    /*
Stuff that makes the list's books show up
    */
   const [showList, setShowList] = useState(false);
   const [selectedList, setSelectedList] = useState();

   function openList() {
    setSelectedList()
    setShowList(true);
   }

   function closeList() {
    setShowList(false);
   }

   /*
   End stuff that makes the list show up
   */
    // useEffect(() => {

    //     if (lists !== undefined) return; //does nothing if lists has something in it
    //     //basically need to do this for any and all cache setups
    //     //does the same thing as your "sexy" cache setup from the midterm

    //     //in-useEffect "state" (we call that a fucking variable)
    //     let cancelled = false;
    //     (async () => {
    //         //
    //         const data = await loadLists(username);
    //         if (!cancelled && Array.isArray(data)) { //cancelled in case user clicks away mid-load
    //             setLists(username, data);         // store the whole array for this user
    //         }
    //     })(); //() makes the function call IMMEDIATELY, no need to call it manually later
    //     return () => { cancelled = true; }; //"cleanup" function that cancels the call if user clicks away
    // }, [lists, username]);

    if (lists === undefined) {
        return error
            ? <p className="m-5 text-danger">{error}</p>
            : <p className="m-5">Loading your lists…</p>;
    }

return (
    <>

        <h1 className="m-5 align-center">Here be your lists...</h1>
        <ListsComponent/>
    </>
)
}