/*
Pulled from FlexPath Midterm Project
*/

import React, { useState, useEffect } from "react";
import { Link, Route, Routes, Router, NavLink } from "react-router-dom";
import Home from "../pages/Home";
import LittleBabyGif from "../../public/LittleBabyGif.gif";
import Logo from "../../public/LogoNoBackground.png";
import "../../styles.css"
//import SearchComponent from "./SearchComponent";
// import ShowAuth from "./ShowAuth";
import { useAuth } from "../contexts/AuthContext";
import RequireAuth from "./RequireAuth";
import NavBarLoginPromptComponent from "./NavBarLoginPromptComponent";
// import LoginPromptComponent from "./LoginPromptComponent";
import { useLocation } from "react-router-dom";

export default function NavBar() {

    const [menu, toggleMenu] = useState(false);
    const { isLoggedIn } = useAuth();

    const location = useLocation();

    function setMenuVisibility() {
        toggleMenu(!menu);
    }

    // function setMenuVisibilityOnComponentChange() {
    //     toggleMenu(false);
    // }
    useEffect(() => {
        toggleMenu(false);
        //dependency is the pathnam in the location OBJECT BROOOOO
    }, [location.pathname]);

    // useEffect(() =>
    //     setMenuVisibilityOnComponentChange()
    // , []);

    return (
        <div className="">
            {/* <h1>Hidden Search Page to Simulate Padding</h1> */}
            <nav className="navbar fixed-top bg-sky-purple site-nav"
                style={{ alignItems: "center", padding: "16px 16px" }}>

                {/* <div style={{justifyContent:"left"}} */}
                <Link to={"/"} className="nav-logo"><img src={Logo} className="little-gif-display"></img></Link>

                <button className="mobile-toggle" id="mobileToggle" onClick={() => setMenuVisibility()}>
                    {menu ? "X" : "☰"}
                </button>

                <ul className={`nav-links ${menu ? 'active' : ''}`}>
                    <NavLink to={"/"}>Home</NavLink>
                    <NavLink to={"/search"}>Search Books</NavLink>
                    <NavLink to={"/add"}>Add A Book</NavLink>
                    {/* <NavLink class="nav-links" to={'/reviews'} onClick={setMenuVisibilityOnComponentChange}>Write A Review</NavLink> */}
                    <NavLink to={'/my-lists'}>My Lists</NavLink>
                    {/* <NavLink to={'/mission'}>Mission Statement</NavLink> */}



                    <NavBarLoginPromptComponent location={location}>
                        <NavLink to={`/my-account`}>My Account</NavLink>
                    </NavBarLoginPromptComponent>
                </ul>
                {/* <ShowAuth role="ROLE_USER" className="col-auto row log-buttons"> */}
                {/* <NavLink class="nav-links" to={'/my-account'}>My Account</NavLink> */}
                {/* </ShowAuth> */}
            </nav>
        </div>
    )
}