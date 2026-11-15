import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../logic/api';

//this is a fallback 
//and is NEVER used inside the provider (where you intent to use it)
const WishListsContext = createContext(null);

export function WishListsContextProvider({ children }) {

    const [lists, setLists] = useState(null);
    const { username, token } = useAuth();

    const [error, setError] = useState(false);

    //force is a var to decide if the lists need to be reloaded.
    /*
    By default, it's set to FALSE, and the default object is also empty.
    This means that if we don't set force to TRUE and the lists state already
    has something in it, then we return the function without running the apiFetch again.
    This allows the context to work somewhat like a cache!
    */

    //resets lists when username changes (logout)
    useEffect(() => {
        setLists(null);
    }, [username]);

    async function loadLists({ force = false } = {}) {
        if (!token || (lists !== null && !force)) return;
        setError(null);
        try {
            setLists(await apiFetch(`/api/wishlists/mine`, { token: token }));
        } catch (err) {
            setError(err.message);
        }
    }

    //this is where the database gets updated, too
    async function addList(wishlist_title) {
        setError(null);
        try {
            const data = await apiFetch(`/api/wishlists/create`,
                {
                    //token direct from the useAuth context provider, 
                    //no need to pass it in as addList(token)
                    token,
                    method: "POST",
                    body: {list_title: wishlist_title},
                }
            );
            //stole this from the former 
            /*
            Functional Update
            Explanation from Claude:
            A value: setLists(newArray) means “the state is now this.”

            A function: setLists(prev => ...) means “React, call this 
            function with the current state, and use whatever it returns 
            as the new state.”   

            "prev" represents the state of lists before the setList call is made
            */
            setLists(prev => [...(prev ?? []), data]);
            //?? [] prevents crash when lists is null/undefined (not yet loaded)
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function removeList(wishlist_id) {
        setError(null);
        try {
            const data = await apiFetch(`/api/wishlists/${wishlist_id}`,
                {
                    token,
                    method: "DELETE",
                }
            );
            //stole this from the former 
            /*
            Functional Update
            Explanation from Claude:
            A value: setLists(newArray) means “the state is now this.”

            A function: setLists(prev => ...) means “React, call this 
            function with the current state, and use whatever it returns 
            as the new state.”   

            "prev" represents the state of lists before the setList call is made
            */
           //this will reform the lists state based on a filter of the previous list
            setLists(prev => (prev ?? []).filter(list => list.id !== wishlist_id));
            //?? [] prevents crash when lists is null/undefined (not yet loaded)
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    //the below uses a fun thing to set a bool:
    //isLoggedIn: !!token
    //will be true if token is not null
    //and false if token is null
    return (
        <WishListsContext.Provider value={{ lists, loadLists, addList, removeList }}>
            {children}
        </WishListsContext.Provider>
    );
}

export const useWishLists = () => useContext(WishListsContext);