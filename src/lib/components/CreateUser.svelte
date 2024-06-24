<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Checkbox, Hr, Input, Label } from 'flowbite-svelte';
	const {
		formSubmit
	}: {
		formSubmit?: SubmitFunction<
			Record<string, unknown> | undefined,
			Record<string, unknown> | undefined
		>;
	} = $props();
	let form: HTMLFormElement;
	let admin = $state(false);
</script>

<form method="post" action="/admin/user/create" use:enhance={formSubmit} bind:this={form}>
	<Label for="username">Username:</Label><Input type="text" name="username" id="username" />
	<Label for="username">Password:</Label><Input type="password" name="password" id="password" />
	<Label for="admin">Admin:</Label><Checkbox name="admin" id="admin" bind:checked={admin} />
	<Hr />
	<Button type="submit">Create User</Button>
</form>
