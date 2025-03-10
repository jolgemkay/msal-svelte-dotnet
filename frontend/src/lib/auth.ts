import { PublicClientApplication } from "@azure/msal-browser";
import { SSO_ATTEMPT_FAILED } from "./storage";


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

const init = async () => {
    console.log("Initializing msalInstance")
    await msalInstance.initialize();
}

const sso = async () => {
    console.log("Checking SSO")
    // prevent repeating sso fails in same session
    if (sessionStorage.getItem(SSO_ATTEMPT_FAILED) === "true") return false;
    try {
        const response = await msalInstance.ssoSilent({});
        return response?.account !== undefined;
    } catch (err: any) {
        if (err?.message.includes("AADSTS50058")) {
            console.log("Interactive logon required")
        } else {
            console.log(err)
        }
        sessionStorage.setItem(SSO_ATTEMPT_FAILED, "true");
        return false;
    }
}

const redirect = async () => {
    console.log("Checking redirect")
    const response = await msalInstance.handleRedirectPromise();
    return response?.account !== undefined;
}


export function login(){
    msalInstance.loginRedirect();
}

export function logout(){
    msalInstance.logoutRedirect();
}

export async function authenticate(): Promise<boolean>{
    try 
    {
        if (currentUser() !== null || await redirect() || await sso()) 
        {
            return false;
        }
        sessionStorage.removeItem(SSO_ATTEMPT_FAILED);
        return true;
    } 
    catch (error: any) 
    {
        if (error?.message.includes("uninitialized_public_client_application")) {
            await init();
            return await authenticate();
        }
        console.log(error)
        return false
    }
}


export const currentUser = () => {
    try {
        const currentAccounts = msalInstance.getAllAccounts();
        if (currentAccounts.length > 0) {
            return currentAccounts[0]
        }
        return null;
    } catch {
        return null
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