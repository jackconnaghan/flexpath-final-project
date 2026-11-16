//checked for external dependencies imports
import React from "react";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
// import { animated } from "@react-spring/web"
// import { useForm } from "@tanstack/react-form";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "../contexts/BooksContext";

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function SearchFormComponent({ onSearch, loading }) {

    //grab search params
    const [searchParams] = useSearchParams();

    const [titleInput, setTitleInput] = useState(() => searchParams.get("title") ?? "");
    const [authorInput, setAuthorInput] = useState(() => searchParams.get("author") ?? "");
    // const [books, setBooks, searchBooks] = useBooks();

    //onSearch comes from the BookSearchComponent and is provided via context
    function handleSubmit(title, author) {
        // setBooks(null);
        onSearch({title, author});
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(titleInput, authorInput);
            }}>
            <label name="title">
                    <input className="form-control w-50"
                        type="text"
                        placeholder="title..."
                        value={titleInput}
                        //this does not work without the brackets, 
                        //as React will not prioritize the onChange event
                        //and will cache it for async
                        onChange={(e) => {
                            setTitleInput(e.target.value);
                        }} />
            </label>
            <label name="author">
                
                    <input className="form-control w-50"
                        type="text"
                        placeholder="author..."
                        value={authorInput}
                        onChange={(e) => {
                            setAuthorInput(e.target.value);
                        }} />
            </label>
            <button type="submit" disabled={loading}>{loading ? "Searching…" : "SEARCH"}</button>
        </form>
    )
}