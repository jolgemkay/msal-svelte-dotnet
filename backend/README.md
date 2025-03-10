### AppSettings

Add ClientId and TenantId to appsettings.json.
ClientId can be the same as frontend (if frontend app registration exposes its own API) or different if backend app registration is separate

AllowedOrgins is used by CORS to allow frontend code in browser to access api host.
It is set to host/port of svelte frontend in this repository

### Run

from /backend folder do:

`dotnet run`
