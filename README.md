# msal-svelte-dotnet
Basic use of MSAL with static Svelte frontend and Dotnet backend


# Prereqs
Create an app registration in your Azure Entra ID tenant. 
1. Go to overview and copy the ClientId and TenantId (directory id)
2. In Authentication page Add Platform and select SPA or Web app. Enter redirectUri = http://localhost:5173 (default svelte). CLICK SAVE
3. Go to Expose API menu and Add Scope, leave Application ID URI and next. Use following and save
    - Scope Name = Default
    - choose Admin and user consent.
    - enter Some Display name
    - enter Some Description
  You should now have a scope: api://{client_id}/Deafult
4. Go to API Permissions -> Add Permission -> My Apis -> Select the app name -> Check the permission created in last step -> Add Permission
5. Go to Manifest. scroll to property api:requestedAccessTokenVersion make sure this is set to 2 (integer not string). click Save

It is possible to create a separate app registration for Api. But we use one that supports login and exposes an api. 
