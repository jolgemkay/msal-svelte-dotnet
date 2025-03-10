<script>
	// This page is protected by auth method
	import { getWeatherforecast } from "$lib/api";

</script>

<p>Data</p>
<button on:click="{() => getWeatherforecast()}">Get something</button>