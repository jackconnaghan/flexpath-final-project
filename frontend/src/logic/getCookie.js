import React from "react";

export function getCookie(name) {

    /*
    SO
    Regular Expressions (constructed with the new RegExp() constructor) 
    are used to provide more robust search of substrings.
    Instead of searching for a precise substring using a String object,
    creating a RegExp builds the searching directly into the object.

    The RegExp uses special characters contained within parentheses to commit specific 
    search parameters to its object.
    For instance, 
    ^ = start of the string
    | = OR
    Square brackets with up-arrow [^] means NOT, and putting a symbol inside means NOT (symbol)
        [^;] = "any character expect ;", "NOT ;"


    Three Parts:
    1. Capture Group 1 ((^|; ))
    2. Literal
    3. Capture Group 2 (([^;]*))
    */
    const match = new RegExp("(^|; )" + name + "([^;]*)");
    //The CG1 looks for the end of a substring that ends in ;
    //The literal "name" finds the same string of characters IF they appear after the CG1
    // --> Together, they find a substring that starts with "; ${name}"
    //CG2 decides where to STOP reading the substring (once it seens another ;)

    /*
    ----------IMPORTANT----------
    THIS WON'T WORK IF YOUR name CONTAINS SPECIAL CHARACTERS LIKE
    From Google: 

.	Matches any single character except line breaks	/\./ (matches a period)
\	The escape character itself	/\\/ (matches a backslash)
^	Matches the beginning of the string/line	/^/ (matches a caret)
$	Matches the end of the string/line	/$/
*	Quantifier: 0 or more times	/\*/ /*
+	Quantifier: 1 or more times	/\+/
?	Quantifier: 0 or 1 time (optional)	/\?/
( / )	Defines a capturing group	/\(/ or /\)/
[ / ]	Defines a character class (set of characters)	/\[/ or /\]/
{ / }	Defines a specific range quantifier (e.g., {1,3})	/\{/ or /\}/
|	Alternation (OR operator)	/|/


    THIS MAKES IT UNUSABLE FOR MORE COMPLICATED STRINGS, 
    BUT FOR OUR PURPOSES IT'S MORE EFFICIENT AND SIMPLER TO REWRITE THAN MAKING SUBSTRINGS
    (I HATE SUBSTRINGS!!!!!!! AND SLICES!!!!)
    */

    /*
    Next we decode the match. decodeURIComponent(x) encodes hex codes in a URIComponent to 
    their plain text translations
    */
   return match ? decodeURIComponent(match[2]) : null;
}