import React from "react";
import Cow from "../../public/Cow.png";
import Book from "../../public/Book.png";

export default function GlobalLayoutComponent({ children }) {

    return (
        <div className="layout-wrapper">
            <div className="cow-gutter left-cow-gutter">
                <div className="inner-cow-gutter row">
                    <img src={Cow} className="the-cow-left" />
                </div>
            </div>

            <main className="">
                {children}
            </main>

            <div className="cow-gutter right-cow-gutter">
                <div className="inner-cow-gutter row">
                    <img src={Cow} className="first-cow-right" />
                </div>

            </div>
        </div>
    )
}