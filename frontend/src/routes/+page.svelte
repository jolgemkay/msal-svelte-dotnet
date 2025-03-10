<script lang="ts">
	import { getWeatherforecast } from "$lib/api";
    import { currentUser, login, logout } from "$lib/auth";


    let user = currentUser()
</script>

<div>
    {#if user}
        <p>{user.username}</p>
        <button on:click={() => logout()}>Log out</button>
        <button on:click={() => getWeatherforecast()}>Get weather</button>
    {:else}
        <button on:click={() => login()}>Log in</button>
    {/if}
    
</div>