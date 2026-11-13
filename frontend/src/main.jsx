import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GlobalLayoutComponent from "./components/GlobalLayoutComponent.jsx";
import { syncAuthFromKeycloak } from "./stores/authorizationStore.js";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalLayoutComponent>
        <App />
      </GlobalLayoutComponent>
    </BrowserRouter>
  </StrictMode>
);
