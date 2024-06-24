<script>
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance>
	<label for="username">Username:</label><input type="text" name="username" id="username" />
	<label for="username">Password:</label><input type="password" name="password" id="password" />
	<button type="submit">Log In</button>
</form>

<style lang="scss">
	form {
		display: grid;
		grid-template-columns: 5rem auto;
		max-width: 20rem;
		button {
			grid-column: span 2;
		}
	}
</style>
