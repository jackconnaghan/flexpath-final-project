import React from "react";
import { useState, useEffect } from "react"


export default function ChangingLetterComponent({prefLetter}) {

    const [isEnglish, setIsEnglish] = useState(false);

    // const alienFile = prefLetter + "_alien";
    // const englishFile = prefLetter + "_english";

    useEffect(() => {
        const delay = 300 + Math.random() * 1300;
        const timer = setTimeout(() => setIsEnglish(true), delay);
        return () => clearTimeout(timer);
    }, []);
    
    const src = `/Lettering/${prefLetter}-${isEnglish ? "english" : "alien"}.png`;

    return (
        <img className="changing-letters"src={src} />
    )
}