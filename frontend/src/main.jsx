import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GlobalLayoutComponent from "./components/GlobalLayoutComponent.jsx";
// import { syncAuthFromKeycloak } from "./stores/authorizationStore.js";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { WishListsContextProvider } from "./contexts/WishListsContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <WishListsContextProvider>
          <GlobalLayoutComponent>
            <App />
          </GlobalLayoutComponent>
        </WishListsContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
