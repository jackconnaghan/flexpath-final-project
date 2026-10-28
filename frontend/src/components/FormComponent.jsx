import React from "react";
import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
import FasterLogo from "../../public/FASTERCompressedLogo.gif";
import { animated } from "@react-spring/web"

// export default function FormComponent({ input, setInput,
//     filterTypeValue, setNewFilterType, filterTypeOptions, 
//     handleSubmit, handleDrop }) {
export default function SearchFormComponent({ titleInput, authorInput, handleSubmit, setTitleInput, setAuthorInput, loading }) {

    return (
        <div>
            <div className="container">
                <form className="col m-4" onSubmit={(e) => {
                    handleSubmit(e);

                }}>
                    <input className="form-control w-50" type="text" placeholder="title..."
                        value={titleInput}
                        //this does not work without the brackets, 
                        //as React will not prioritize the onChange event
                        //and will cache it for async
                        onChange={(e) => {
                            setTitleInput(e.target.value)
                        }

                        }></input>
                    <br></br>
                    <input className="form-control w-50" type="text" placeholder="author..."

                        onChange={(e) => {
                            setAuthorInput(e.target.value)
                        }}></input>

                    <button type="submit" className="btn btn-primary sexy-btn">Submit</button>
                    
                </form>
                <animated.div className="animation-edit" />

            </div>
        </div>
    )
}