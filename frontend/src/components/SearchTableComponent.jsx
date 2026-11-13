//checked for external dependencies imports
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import { useForm } from "@tanstack/react-form";
import { useWishListStore } from "../stores/useWishListStore";
import { useAuthStore } from "../stores/authorizationStore";
import RequireAuth from "./RequireAuth";
import AddBookToWishListModalComponent from "./AddBookToWishListModalComponent";
import ShowAuth from "./ShowAuth";
import RevealOnAuth from "./RevealOnAuth";

export default function SearchTableComponent({ response }) {

    // const username = useAuthStore((s) => s.user.username);
    //setting local state for caching a user's lists
    //sets the list of lists' username to the above
    // const lists = useWishListStore((s) => s.userLists[username]);

    // const [open, setOpen] = useState(false);
    // const [selectedRow, setSelectedRow] = useState();

    // // const { userLists } = useWishListStore();


    // function openModal(item) {
    //     setOpen(true);
    //     setSelectedRow(item);
    // }

    // function closeModal() {
    //     setOpen(false);
    // }
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState();

    function openModal(item) {
        setSelectedRow(item);
        setOpen(true);

    }

    const dataAreas = [
        "Title",
        "Author",
        "Publication Year",
        "ISBN-13",
        "Pages"
    ];





    // function handleAddToWishlist(item) {
    //     //this works
    //     // let book_id = item.id;
    //     // console.log(book_id);
    //     setModal(true);
    // }

    /*
    Need a function to pass a book's information to the BookInfoModalComponent
    */




    return (
        <div>
            <RequireAuth role="ROLE_USER" customMessage="Log In or Create An Account to add books to a List.">
                <KeepButtonHiddenAndHandleItsBS open={open} selectedRow={selectedRow} openModal={openModal} setOpen={setOpen} setSelectedRow={setSelectedRow} />
            </RequireAuth>

            <table className="table container-fluid px-0 table-striped w-100%">
                <thead>
                    <tr>
                        <RevealOnAuth role="ROLE_USER">
                            <th></th>
                        </RevealOnAuth>
                        {dataAreas.map((item, key) => (
                            <th scope="col" key={key}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(response?.length > 0) && (
                        response.map(item => (
                            //pass the iterator at the top level
                            <tr className="col" key={item["id"]}>
                                <RevealOnAuth role="ROLE_USER">
                                    <td>
                                        <button type="link" className="col" onClick={(e) => {
                                            e.preventDefault();
                                            openModal(item);
                                        }}>
                                            Add to List
                                        </button>
                                    </td>
                                </RevealOnAuth>
                                <td>{item["title"]}</td>
                                <td>{item["author"]}</td>
                                <td>{item["pub_year"]}</td>
                                <td>{item["isbn13"]}</td>
                                <td>{item["pages"]}</td>

                                {/* <td>
                                    <button type="link" className="col" onClick={(e) => {
                                        handleSendToReview(e, item);
                                    }}>Write a Review</button>
                                </td> */}


                            </tr>


                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

//additional component to handle the buttons and modal when a user is logged in
function KeepButtonHiddenAndHandleItsBS({ open, selectedRow, openModal, setSelectedRow, setOpen }) {

    const username = useAuthStore((s) => s.user.username);
    const lists = useWishListStore((s) => s.userLists[username]);
    const { userLists } = useWishListStore();



    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    function closeModal() {
        setOpen(false);
    }


    return (
        <>
            {open ?
                <AddBookToWishListModalComponent setSelectedRow={setSelectedRow} selectedRow={selectedRow} modalStyle={modalStyle}
                    openModal={openModal} closeModal={closeModal} open={open} />
                : null}
        </>
    );
}

SearchTableComponent.propTypes = {
    response: PropTypes.arrayOf(PropTypes.object)
};