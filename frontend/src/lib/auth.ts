import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";


const CLIENT_ID = ""
const TENANT_ID = ""
const API_CLIENT_ID = "" // Use this if the API and Frontend are different App registrations in Entra
const REDIRECT_URI = "http://localhost:5173" // This is the default SvelteKit host/port

const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: REDIRECT_URI,
    authority:
      `https://login.microsoftonline.com/${TENANT_ID}/v2.0/`,
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to true if you are having issues on IE11 or Edge
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();

export function login(){
    msalInstance.loginRedirect();
}

export function logout(){
    msalInstance.logoutRedirect();
}

export async function auth(): Promise<AccountInfo | null>{
    try {
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
            return response.account

        } else {
            const currentAccounts = msalInstance.getAllAccounts();
            if (currentAccounts.length === 1) {
                return currentAccounts[0]
            }
        }
        return null
    } catch (error) {
        console.log(error);
        return null
    }
}

export const currentUser = () => {
    try {
        return msalInstance.getAllAccounts()[0];
    } catch {
        return null;
    }
}

// Gets token with with API permission scope ("Default")
export const aquireToken = async () => {
    const account = currentUser();
    if(account === null) throw new Error("No authenticated user found")
    const req = {
        scopes: [`${!API_CLIENT_ID ? CLIENT_ID : API_CLIENT_ID}/Default`],
        authority: `https://login.microsoftonline.com/${TENANT_ID}/v2.0/`,
        account: account
    }
    try {
        const tokenResponse = await msalInstance.acquireTokenSilent(req)
        return tokenResponse.accessToken;
    } catch {
        // First time aquiring token, the user must consent to the app getting some user data.
        const newToken = await msalInstance.acquireTokenPopup(req)
        return newToken.accessToken;
    } 
}

