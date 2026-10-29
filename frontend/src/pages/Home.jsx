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
        <div className="extend-under-navbar">
            <div className="in-space grid-container">
                <img className="grid-item logo-aliens-sizing-home flex-center space-children" src={LogoGif}></img>
                <div className="flexbox grid-item">
                    <div className="flexbox space-children">
                        <ChangingLetterComponent prefLetter="W" />
                        <ChangingLetterComponent prefLetter="E" />
                        <ChangingLetterComponent prefLetter="L" />
                        <ChangingLetterComponent prefLetter="C" />
                        <ChangingLetterComponent prefLetter="O" />
                        <ChangingLetterComponent prefLetter="M" />
                        <ChangingLetterComponent prefLetter="E" />
                    </div>


                    <h3 className="rep-text space-children">A repository for the human-minded alien</h3>
                    <h1 className="heading-text space-children row">Help Us Document the Earthlings</h1>
                </div>
                <img className="grid-item logo-aliens-sizing-home flex-center space-children" src={LogoGif}></img>



            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="col-auto">
                    <h2 className="row-auto m-3">Our Mission</h2>
                    <p className="row-auto m-3">It is our duty to colonize the Earthling races. </p>
                    <p className="row-autom-3">Just two freaky aliens trying to make a difference.</p>
                </div>

                {/* <div className="row rest-of-Home p-4 m-1"> */}
                <div className="row a-center">
                    <div className="">
                        <Link to="/search">
                            <button className="home-buttons col m-3">Find a Book</button>
                        </Link>
                        <Link to="/add">
                            <button className="home-buttons m-3">Add a Book</button>
                        </Link>

                        <Link to="/mission">
                            <button className="home-buttons hover-home m-3">About Us</button></Link>
                        <button className="home-buttons m-3">Donate</button>
                    </div>
                    <div className="col-auto aliens-together">
                        <img src={AliensTogether} alt="Two aliens standing together and waving to the camera" />
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Home;