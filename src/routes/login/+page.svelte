<script>
	import { enhance } from '$app/forms';
	import { Label, Button, Input, Heading, Card } from 'flowbite-svelte';
</script>

<Heading>URL Shortener</Heading>
<Card>
	<Heading tag="h2">Log In</Heading>
	<form method="post" use:enhance class="max-w-sm">
		<Label for="username">Username:</Label><Input type="text" name="username" id="username" />
		<Label for="username">Password:</Label><Input type="password" name="password" id="password" />
		<Button type="submit" class="mt-4">Log In</Button>
	</form>
</Card>
