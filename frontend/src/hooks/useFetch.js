import { useState } from "react";
// import keycloak from "../keycloak";
import { apiFetch } from "../logic/api";

//for my next trick, I will create a custom hook
//to take care of fetching data from the server
export default function useFetch() {

    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [statusCode, setStatusCode] = useState(null);

    async function fetchDataCreateBook(baseURL, sendingBook, method) {
        //sets error to false in case the last submission attempt
        //failed
        setLoading(true);
        setError(false);
        setStatusCode(null);

        //const url = `${baseURL}`
        //setting the setTimeout promise in this way
        //bypasses having to set the setTimeout around the try/catch
        // block, which wouldn't work anyway due to rules of hooks
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            /*
            BROOOOOO I JUST GOT RID OF SO MUCH SHIT
            check api.js for the centralized/abstracted fetch request code
            AND IN THE FUTURE
            just use Tanstack Queryg 
            */
            setResponse(await apiFetch(baseURL, { method, body: sendingBook }));
            console.log(`response length: ${response.length}`);
            const responseData = await response;
            console.log(sendingBook);


            setLoading(false);
            setStatusCode(response.status);
            return responseData;
        } catch (error) {
            //even though error is a boolean when it's declared,
            //setting it to a string works just fine. Who knows 
            //why. I didn't build react
            setError(error.message);
            console.error(`Fetch error: ${error}`);
            setLoading(false);
            // setStatusCode(response.status);
            return null;
        }

        // return !error ? JSON.stringify(response) : null;
    }

    async function fetchSearchData(baseURL, method) {
        //sets error to false in case the last submission attempt
        //failed
        setLoading(true);
        setError(false);

        //const url = `${baseURL}`
        //setting the setTimeout promise in this way
        //bypasses having to set the setTimeout around the try/catch
        // block, which wouldn't work anyway due to rules of hooks
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            
            setResponse(await apiFetch(baseURL, { method }));
            console.log(`response length: ${response.length}`);
            const responseData = response;

            setLoading(false);
            setStatusCode(response.status);
            return responseData;
        } catch (error) {
            //even though error is a boolean when it's declared,
            //setting it to a string works just fine. Who knows 
            //why. I didn't build react
            setError(error.message);
            console.error(`Fetch error: ${error}`);
            setLoading(false);
            return null;
        }
    }
    /*
    ///
    LOOK INTO CONSOLIDATING THIS AND THE ABOVE FUNCTIONS
    INTO ONE "fetchGET" FUNCTION. THEY ACCEPT THE SAME PARAMS
    AND ARE ABSTRACTED ALREADY
    ///
    */
    async function fetchUserLists(baseURL, method) {
        //sets error to false in case the last submission attempt
        //failed
        setLoading(true);
        setError(false);
        setStatusCode(null);

        try {

            setResponse(await apiFetch(baseURL, { method }));
            console.log(`response length: ${response.length}`);
            const responseData = response;

            setLoading(false);
            setStatusCode(response.status);
            return responseData;
        } catch (error) {
            setError(error.message);
            console.error(`Fetch error: ${error}`);
            setLoading(false);
            return null;
        }
    }

    // Passing setResponse allows me to call it within SearchComponent,
    // which allows me to set the response (what is rendered)
    // to whatever was set in "cache" without holding a 
    // "localResponse" variable (confusing and clunky)
    return ({
        fetchData: fetchDataCreateBook,
        fetchSearchData,
        fetchUserLists,
        setResponse,
        response,
        loading,
        error,
        statusCode
    });
}