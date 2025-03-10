
## Settings: 
In /frontend/src/lib/auth.ts set CLIENT_ID and TENANT_ID 
Remember that this is a static frontend application, so .env files are not supported. 
CLIENT_ID and TENANT_ID is assumed to be public information and can be accessible by anonymous users. 

## Developing
from /frontend folder do:

```bash
npm install
npm run dev
```

## Build SSR (adapter-node)
Build and output to /build folder
`npm run build`

Then:

Windows CMD: 
`SET PORT=5173&&node build`

Linux:
`PORT=5173 node build`


# Build SPA (adapter-static)
We can also run this as pure SPA in frontend. 
Go to svelte.config and uncomment adapter-static import, and comment out adapter-node. 
Also uncomment adapter-static options

We build the same way:
`npm run build`


To host static files just run
`node static-host.js`

