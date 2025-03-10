import { aquireToken } from "./auth";

const API_BASE_URL = "http://localhost:5107" //Default dotnet webapi host/port

export async function getWeatherforecast(){
    return await authFetch("/weatherforecast/", "GET");
}


// This acts as auth wrapper around fetch. 
export async function authFetch(path: string, method: string, body?: any)
{
    const token = await aquireToken();
    return await fetch(`${API_BASE_URL}${path}`, {
        method: method,
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}