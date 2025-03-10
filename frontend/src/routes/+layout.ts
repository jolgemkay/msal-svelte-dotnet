import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Disable server side rendering, because we want a static web app
export const ssr = false;

// Routes that allow anonymous access
const excludedRoutes = ["/", "/error"]

// Load function is run on every route and checks if user is authenticated
export const load: LayoutLoad = async ({url}) => {
    const user = await auth();

    if (user === null && !excludedRoutes.includes(url.pathname))
    {
        redirect(302, '/');
    }
    // Remove auth code from Entra Id login redirect
    if (url.href.includes("#code=")) {
        redirect(303, '/')
    }
    return;
}