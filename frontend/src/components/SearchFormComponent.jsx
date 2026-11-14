//checked for external dependencies imports
import React from "react";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
// import { animated } from "@react-spring/web"
// import { useForm } from "@tanstack/react-form";
import useFetch from "../hooks/useFetch";
import { useState } from "react";

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function SearchFormComponent({ onSearch, loading }) {

    const [titleInput, setTitleInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");

    // const form = useForm({
    //     defaultValues: {
    //         title: "",
    //         author: "",
    //     },
    //     onSubmit: async ({ value }) => {
    //         onSearch(value);
    //     },
    //     // validators: {
    //     //     onSubmit
    //     // }
    // }
    // );
    function handleSubmit(title, author) {
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