/*
Pulled from FlexPath Midterm Project
*/

import React from "react";
import { Link, Route, Routes, Router, NavLink } from "react-router-dom";
import Home from "../pages/Home";
import LittleBabyGif from "../../public/LittleBabyGif.gif";
import Logo from "../../public/LogoNoBackground.png";
import "../../styles.css"
//import SearchComponent from "./SearchComponent";

export default function NavBar() {

    return (
        <div className="">
            {/* <h1>Hidden Search Page to Simulate Padding</h1> */}
            <nav className="navbar navbar-dark bg-sky-purple fixed-top flex-gap super-navbackground gap-3"
                style={{ alignItems: "center", padding:"16px 16px", justifyContent: "left"}}>
                <Link to={"/"}><img src={Logo} className="little-gif-display"></img></Link>
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/search"}>Search Books</NavLink>
                <NavLink to={"/add"}>Add A Book</NavLink>
                <NavLink to={'/mission'}>Mission Statement</NavLink>
                

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