<script lang="ts">
	// This page is default error page
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error?.message}</h1>