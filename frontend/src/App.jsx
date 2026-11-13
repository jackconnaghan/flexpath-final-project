/*
Pulled from FlexPath Midterm Project
*/

import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import Home from "./pages/Home";
// import SearchResults from "./pages/Search";
//import Search from "./components/SearchComponent";
import NavBar from "./components/NavBar";
// import PageNotFound from "./pages/PageNotFound";
// import SearchComponent from "./components/SearchComponent";
// import { CacheProvider } from "./contexts/CacheResultsContext";
// import ErrorBoundary from "./components/ErrorBoundary";
import BookSearchPage from "./pages/BookSearchPage"
import PageNotFound from "./pages/PageNotFound"
import AddBookComponent from "./components/AddBookComponent";
import MissionStatementPage from "./pages/MissionStatementPage";
import RequireAuth from "./components/RequireAuth";
import AddBookPage from "./pages/AddBookPage";
import WishListsPage from "./pages/WishListsPage";
import ReviewsPage from "./pages/ReviewsPage";
import ListDetailPage from "./pages/ListDetailPage";

function App() {

  //const [cache, setCache] = useState(null);

  return (
    // <CacheProvider value={cache}>
    <div className="app-background">
      <NavBar />

      <br></br>
      <div>
        <Routes>
          {/* Even though some links live exclusively in the NavBar
        component, all <Routes> are instantiated in the 
          App.jsx file to ensure high-level compatibility. */}
          <Route class="FlexPath Final Project" path="/" element={<Home />} />
          {/* <Route class="Search Page" path="/search" element={<SearchResults />} /> */}
          <Route class="Page Not Found" path="/*?" element={<PageNotFound />} />
          <Route class="Search" path="/search" element={<BookSearchPage />} />
          <Route class="Add Book" path="/add" element={
            <div className="extend-under-navbar">
              <RequireAuth role="ROLE_USER" customMessage="Log in to create a book.">
                <AddBookPage />
              </RequireAuth>
            </div>

          } />
          {/* <Route class="MyReviews" path="/reviews" element={
            <RequireAuth role="ROLE_USER">
              <ReviewsPage />
            </RequireAuth>
          } /> */}
          <Route class="MyLists" path="/my-lists" element={
            <div className="extend-under-navbar">
              <RequireAuth role="ROLE_USER" customMessage="Sign In or Sign Up to make and view lists.">
                <WishListsPage />
              </RequireAuth>
            </div>
          } />
          <Route class="MyUniqueWishList" path="/my-lists/:listId" element={
            <div className="extend-under-navbar">
              <RequireAuth role="ROLE_USER" customMessage="How'd you get here???">
                <ListDetailPage />
              </RequireAuth>
            </div>
          }
          />



          <Route class="Our Mission" path="/mission" element={<MissionStatementPage />} />
        </Routes>
      </div>
    </div>
    // </CacheProvider>
  );
}

export default App;
