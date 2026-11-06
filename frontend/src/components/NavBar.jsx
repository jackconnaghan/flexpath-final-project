/*
Pulled from FlexPath Midterm Project
*/

import React, { useState } from "react";
import { Link, Route, Routes, Router, NavLink } from "react-router-dom";
import Home from "../pages/Home";
import LittleBabyGif from "../../public/LittleBabyGif.gif";
import Logo from "../../public/LogoNoBackground.png";
import "../../styles.css"
//import SearchComponent from "./SearchComponent";
import ShowAuth from "./ShowAuth";

export default function NavBar() {

    const [menu, toggleMenu] = useState(false);

    function setMenuVisibility() {
        toggleMenu(!menu);
    }


    return (
        <div className="">
            {/* <h1>Hidden Search Page to Simulate Padding</h1> */}
            <nav className="navbar navbar-dark bg-sky-purple fixed-top flex-gap super-navbackground gap-3 log-buttons-holder"
                style={{ alignItems: "center", padding: "16px 16px", justifyContent: "left" }}>

                <Link to={"/"}><img src={Logo} className="little-gif-display thumbnail"></img></Link>
                <ul className={`nav-links ${menu ? 'active' : ''}`}>
                    <NavLink class="nav-links" to={"/"}>Home</NavLink>
                    <NavLink class="nav-links" to={"/search"}>Search Books</NavLink>
                    <NavLink class="nav-links" to={"/add"}>Add A Book</NavLink>
                    <NavLink class="nav-links" to={'/reviews'}>Write A Review</NavLink>
                    <NavLink class="nav-links" to={'/my-lists'}>My Lists</NavLink>
                    <NavLink class="nav-links" to={'/mission'}>Mission Statement</NavLink>
                </ul>
                <ShowAuth role="ROLE_USER" className="col-auto row log-buttons">
                        <NavLink class="nav-links" to={'/my-account'}>My Account</NavLink>
                    </ShowAuth>





                <button className="mobile-toggle" id="mobileToggle" onClick={() => setMenuVisibility()}>
                    ☰
                </button>


            </nav>
            {/* Regarding these breaks: The internet's solution
            to keep a position:fixed HTML React component from covering 
            other components that render at the top of the page is 
            to add a padding attribute to the covered elements. Since that
            would involve adjusting each component in the project,
            and is pretty hokey anyway,
            I opted to add breakpoints below to simulate the effect. */}
            {/* <br></br>
            <br></br>
            <br></br> */}
        </div>
    )
}