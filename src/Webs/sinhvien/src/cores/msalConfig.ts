import { PublicClientApplication } from "@azure/msal-browser";


export const msalInstance = new PublicClientApplication({
    auth: {
        clientId: "0f7c379c-0685-4e1d-96e3-42c9e3f7381c",
        authority: "https://login.microsoftonline.com/bbf9aad6-5f58-4387-927e-02f0b07a72fa",
        redirectUri: "http://localhost:5173",
        postLogoutRedirectUri: "http://localhost:5173/login",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
});