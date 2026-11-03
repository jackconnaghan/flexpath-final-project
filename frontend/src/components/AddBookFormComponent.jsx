/*
DEFUNCT, I moved the form directly into AddBookComponent
*/




//import React from "react";
// import NormalSpeedLogo from "../../public/NormalSpeedGif.gif"
// import FasterLogo from "../../public/FASTERCompressedLogo.gif";
// import { animated } from "@react-spring/web"

// // export default function FormComponent({ input, setInput,
// //     filterTypeValue, setNewFilterType, filterTypeOptions, 
// //     handleSubmit, handleDrop }) {
// export default function AddBookFormComponent({ titleInput, authorInput,
//     handleSubmit, setTitleInput, setAuthorInput,
//     isbnInput, setIsbnInput, pubYearInput, setPubYearInput,
//     pagesInput, setPagesInput }) {

//     return (
//         <div>
//             <div className="container extend-under-navbar">
//                 <form className="col" onSubmit={(e) => {
//                     handleSubmit(e);

//                 }}>
//                     <p>Title</p>
//                     <input className="form-control w-50 custom-input" type="text" placeholder="title..."
//                         value={titleInput}
//                         //this does not work without the brackets, 
//                         //as React will not prioritize the onChange event
//                         //and will cache it for async
//                         onChange={(e) => {
//                             setTitleInput(e.target.value)
//                         }

//                         }></input>
//                     <br></br>
//                     <p>Author</p>
//                     <input className="form-control w-50 custom-input" type="text" placeholder="author..."
//                         value={authorInput}
//                         onChange={(e) => {
//                             setAuthorInput(e.target.value)
//                         }}>

//                     </input>
//                     <br></br>
//                     <p>Publication Year</p>
//                     <input className="form-control w-50 custom-input" type="text" placeholder="year published..."
//                         value={pubYearInput}
//                         onChange={(e) => {
//                             setPubYearInput(e.target.value)
//                         }}>
//                     </input>
//                     <br></br>
//                     <p>ISBN-13</p>
//                     <input className="form-control w-50 custom-input" type="text" placeholder="isbn..."
//                         value={isbnInput}
//                         onChange={(e) => {
//                             setIsbnInput(e.target.value)
//                         }}>
//                     </input>
//                     <br></br>
//                     <p>Number of Pages</p>
//                     <input className="form-control w-50 custom-input" type="text" placeholder="pages..."
//                         value={pagesInput}
//                         onChange={(e) => {
//                             setPagesInput(e.target.value)
//                         }}>
//                     </input>

//                     <button type="submit" className="btn btn-primary sexy-btn">Submit</button>

//                 </form>
//                 <animated.div className="animation-edit" />

//             </div>
//         </div>
//     )
// }