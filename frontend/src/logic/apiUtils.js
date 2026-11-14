//small wrapper for extracting roles from the token
//will inform whether or not a user sees admin controls

export function getRoles(token) {
    try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        //atob(string) decodes a string that's been encoded with Base64 encoding,
        //which is how JWT tokens are encoded
        return JSON.parse(atob(payload)).authorities ?? [];
    } catch {
        return [];   // a malformed or corrupted token in storage → treat as no roles
    }
}