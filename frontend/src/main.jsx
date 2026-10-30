import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GlobalLayoutComponent from "./components/GlobalLayoutComponent.jsx";
import keycloak from "./keycloak.js";
import { syncAuthFromKeycloak } from "./stores/authorizationStore.js";

keycloak
  .init({
    onLoad: "check-sso",       // find out if already logged in, but don't force a login
    pkceMethod: "S256",
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  })
  .catch((err) => console.error("Keycloak init failed", err))
  .finally(() => {
    syncAuthFromKeycloak();
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <BrowserRouter>
          <GlobalLayoutComponent>
            <App />
          </GlobalLayoutComponent>
        </BrowserRouter>
      </StrictMode>
    );
  });

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <GlobalLayoutComponent>
//         <App />
//       </GlobalLayoutComponent>
//     </BrowserRouter>
//   </StrictMode>
// );
