//checked for external dependencies 
import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import SearchTableComponent from "./SearchTableComponent";
import SearchFormComponent from "./SearchFormComponent";
import SearchTextResponseComponent from "./SearchTextResponseComponent";
import ErrorBoundary from "./ErrorBoundary";
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif";
import NoBackgroundLogo from "../../public/NoBackgroundLogo.png"
import Landed from "../../public/Landed.png";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "../contexts/BooksContext";

export default function BookSearchComponent({ method }) {

    //declare states for page updates, keeping this local
    const [titleInput, setTitleInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    // pulling object from useFetch that gives us all vars in that hook
    // const { fetchSearchData, setResponse, response, loading, error, statusCode } = useFetch();
    const { results, loading, error, searchBooks } = useBooks();

    // //run when Submit is clicked
    // //handles fetch logic by
    /*
1. setting searchParams (local), which changes the URL
2. useSearchParams will treat it as a state, re-rendering every comp THAT USES THE USESEARCHPARAM hook
    -> kinda like a context
3. useSearchParams update causes SearchFormComponent and BookSearchComponent to rerender
4. When BookSearchComponent rerenders, it sets queryParams = toString(searchParams)
    -> queryParams basically updates a "cache"
5. useEffect runs when queryParams changes
    -> if queryParams = null, nothing happens (no search made yet)
    -> if queryParams = SOMETHING, searchBooks runs with the new queryParams
6. Books in list are updated with the former search results
 
I will not remember how this works in a week I am so tired
    */
    async function onSearch({title, author}) {
        // e.preventDefault();
        //grabbing keyword and filter and setting params
        //before sending off to useFetch

        // const params = new URLSearchParams();
        // (title.trim()) ? params.set("title", title.trim()) : params.set("title", "");
        // (author.trim()) ? params.set("author", author.trim()) : params.set("author", "");
        setSearchParams({ title: title.trim(), author: author.trim() })

        //the below fetch gets replaced with a useEffect that checks the URLSearchParams
        //and automatically loads books that match those params
        // fetchSearchData(`/api/books/search?${params}`, "GET");

        //console.log(`base: ${baseURL}`);
    }

    //grabs the params out of the url and sets them in a string
    const queryParams = searchParams.toString();

    useEffect(() => {
        //if no searchParams set yet, quit out
        if (!queryParams) return;
        //otherwise, call searchBooks on the queryParams
        searchBooks(queryParams);
    }, [queryParams]);
    // //responds to change in filterType selector in the form
    // function setNewFilterType(e) {
    //     setFilterTypeValue(e.target.value);
    //     return filterTypeValue;
    // }


    // //useEffect to call the CacheResultsContext to maintain
    // //fetched results, is called whenever response changes
    // useEffect(() => {
    //     setCachedResponse(response);
    //     //setLocalResponse(response);

    // }, [response]);

    // // useEffect to log the cache and set response
    // // to whatever value is still in cache. This
    // // maintains results between page navigation
    // useEffect(() => {
    //     if (Array.isArray(cache)) {
    //         setResponse(cache);
    //     }
    //     //run on page reload, check if cache is an array. If it is,
    //     //that means setCachedResponse has been run, which means we've already made a search.
    // }, []);
    /* According to Claude, this setup of caching the response wastes a render. */
    /* Look into refactoring the useEffects so that response gets set from whether or not
    cache is an array...

    A cleaner option

Since you only need the cache when the component first loads, you can drop the second effect and initialize state from the cache directly:

javascript
const [response, setResponse] = useState(() =>
  Array.isArray(cache) ? cache : null
);

This avoids a wasted first render with empty data, and there’s no effect that could loop. */

    // The following is some silliness to enable a fun easter egg 
    // (and reach the "exceeding expectations" tier of the project grade).
    // handleDragStart is called when the image, which is only displayed
    // with a certain text input, is dragged.

    // e.dataTransfer.setData takes two params:
    // (dataFormat, attributeName). It sets the DragData object 
    // to a "text/plain" type attribute and sets that "text/plain" type 
    // attribute to the target HTML section's alt text.
    // const handleDragStart = (e) => {
    //     e.dataTransfer.setData("text/plain", e.target.alt)
    // }
    // This function once again prevents default before
    // creating a new variable "droppedAltText" which runs the getData 
    // function on the dataTransfer object of e. This places the 
    // value of dataTransfer's attribute "text/plain" in droppedAltText.
    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     setFilterTypeValue("model");
    //     setInput(e.dataTransfer.getData('text/plain'));
    // }
    // return component layout
    // console.log(response?.length);
    return (
        <div className="container">
            <div className="row flex-wrap g-5 mb-3">
                <div className="col-auto">
                    <div className="search-form">
                        <SearchFormComponent onSearch={onSearch} loading={loading} />
                        
                    </div>
                    
                </div>

            </div>
            <ErrorBoundary>
                <SearchTextResponseComponent response={results} loading={loading} error={error} />
            </ErrorBoundary>
            <SearchTableComponent response={results} />
        </div>

    );
}