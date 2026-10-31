import React, { useState } from "react";
import LogoGif from "../../public/NormalSpeedGif.gif";
import { Link } from 'react-router-dom';
import "../../styles.css";
import ChangingLetterComponent from "../components/ChangingLetterComponent";
import AliensTogether from "../../public/aliens-together.webp";

function Home() {

    //For all pages, I will be doing the formatting and logic
    //of the content before worrying about css. So things may 
    //get hairy.

    return (
        <div className="extend-under-navbar container">
            <div className="in-space">
                <div className="row justify-content-center align-items-center">
                    <img className="col-1 home-logo-no-stretch" src={LogoGif}></img>
                    <div className="row col">
                        <div className="col text-center">
                            <ChangingLetterComponent prefLetter="W" />
                            <ChangingLetterComponent prefLetter="E" />
                            <ChangingLetterComponent prefLetter="L" />
                            <ChangingLetterComponent prefLetter="C" />
                            <ChangingLetterComponent prefLetter="O" />
                            <ChangingLetterComponent prefLetter="M" />
                            <ChangingLetterComponent prefLetter="E" />

                        </div>
                        <div className="row">
                            <h3 className="text-center">A repository for the human-minded alien</h3>
                            <h1 className="text-center">Alien Book Club</h1>
                        </div>
                    </div>
                    <img className="col-1 home-logo-no-stretch" src={LogoGif}></img>


                </div>
            </div>

            <div>
                <div className="col home-button-layout">
                    <Link to="/search">
                        <button className="col home-buttons hover-home m-3">Find a Book</button>
                    </Link>
                    <Link to="/add">
                        <button className="col home-buttons hover-home m-3">Add a Book</button>
                    </Link>
                    <Link to="/mission">
                        <button className="col home-buttons hover-home m-3">About Us</button></Link>
                    <button className="col home-buttons hover-home m-3">Donate</button>
                </div>
            </div>
            <div className="home-button-layout ">
                <img src={AliensTogether}
                    className="aliens-together"
                    alt="Two aliens standing together and waving to the camera" />
            </div>
            <div className="home-button-layout">
                <p className="funny-home-text">We're just two freaky alien dudes trying to make a difference.</p>
                <p className="funny-home-text">We're trying to take over planet Earth, one book at a time.</p>
                <p className="funny-home-text">But we can't do it alone.</p>
                <p className="funny-home-text">Help us document the human race's literary "achievements".</p>
            </div>
        </div>
    )
}

export default Home;