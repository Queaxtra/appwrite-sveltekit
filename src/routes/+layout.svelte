<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

	:global(body) {
		background-color: #f9f9f9;
		font-family: 'Outfit', sans-serif;
		margin: 0;
		padding: 0;
		justify-content: center;
	}
</style>