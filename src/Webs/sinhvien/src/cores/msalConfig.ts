import { PublicClientApplication } from "@azure/msal-browser";


export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.TENANT_ID}`,
    redirectUri: import.meta.env.REDIRECT_URL,
    postLogoutRedirectUri: `${import.meta.env.REDIRECT_URL}/login`,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
});
