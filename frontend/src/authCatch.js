/*
Ok let's make something akin to keycloak.js
*/
const keycloak = new Keycloak({
    url: "http://localhost:8090",
    realm: "book-review-app",
    clientId: "book-review-spa",
});

export default keycloak;
