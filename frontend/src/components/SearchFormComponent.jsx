import React from "react";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
import { animated } from "@react-spring/web"
import { useForm } from "@tanstack/react-form";
import useFetch from "../hooks/useFetch";

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function SearchFormComponent({onSearch, loading }) {

    const form = useForm({
        defaultValues: {
            title: "",
            author: "",
        },
        onSubmit: async ({value}) => {
            onSearch(value);
        },
        // validators: {
        //     onSubmit
        // }
    }
    );

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit({});
            }}>
            <form.Field name="title">
                {(field) => (
                    <input className="form-control w-50"
                        type="text"
                        placeholder="title..."
                        value={field.state.value}
                        //this does not work without the brackets, 
                        //as React will not prioritize the onChange event
                        //and will cache it for async
                        onChange={(e) => {
                            field.handleChange(e.target.value);
                        }} />
                )}
            </form.Field>
            <form.Field name="author">
                {(field) => (
                    <input className="form-control w-50"
                        type="text"
                        placeholder="author..."
                        value={field.state.value}
                        onChange={(e) => {
                            field.handleChange(e.target.value);
                        }} />
                )}
            </form.Field>
            <button type="submit" disabled={loading}>{loading ? "Searching…" : "SEARCH"}</button>
        </form>
    )
}