import React, { useState, useEffect } from "react";
// import kOnzy from "/kOnzy.gif";
// import scaredyDog from "/scaredyDog.jpeg"
// import { useCache } from "../contexts/CacheResultsContext";
// import useFetch from "../hooks/useFetch";
// import SearchMetricCardsComponent from "./SearchMetricCardsComponent";
// import SearchTableComponent from "./SearchTableComponent";
import FormComponent from "./FormComponent";
// import TextResponseComponent from "./TextResponseComponent";
// import ErrorBoundary from "./ErrorBoundary";

export default function BookSearchComponent() {
    // //declare states for page updates, keeping this local
    // const [input, setInput] = useState("");
    // const [filterTypeValue, setFilterTypeValue] = useState("unfiltered");

    // //pulling object from useFetch that gives us all vars in that hook
    // //const { fetchData, setResponse, response, loading, error } = useFetch();

    // //this pulls the exact variables from
    // //CacheResults Context and allows them to
    // //mutate within SearchComponent
    // const { cache, setCachedResponse } = useCache(null);

    // //declare filterType choices
    // const filterTypeOptions =
    //     ["unfiltered", "gender", "operatingSystem", "model", "behaviorclass"];

    // //run when Submit is clicked
    // //handles fetch logic with useFetch hook
    // async function handleSubmit(e) {
    //     e.preventDefault();
    //     //grabbing keyword and filter and setting params
    //     //before sending off to useFetch
    //     const searchParams = new URLSearchParams({
    //         filterType: filterTypeValue,
    //         keyword: input.trim(),
    //     });

    //     const baseURL = `/api/data/search?`;

    //     fetchData(baseURL, searchParams);
    //     setInput("");
    // }
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
        <div className="container m-0">
            <h3>This is the BookSearchComponent. Say hi!</h3>

        </div>

    );
}