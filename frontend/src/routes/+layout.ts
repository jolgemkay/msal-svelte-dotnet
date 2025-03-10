import { authenticate } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Disable server side rendering. This must run i frontend
export const ssr = false;
export const prerender = true;

// Routes that allow anonymous access
const excludedRoutes = ["/", "/error"]

// Load function is run on every route and checks if user is authenticated
export const load: LayoutLoad = async ({url}) => {
    if (!await authenticate() && !excludedRoutes.includes(url.pathname))
    {
        redirect(302, '/');
    }
    // Remove auth code from Entra Id login redirect
    if (url.href.includes("#code=")) {
        redirect(303, '/')
    }
    return;
}