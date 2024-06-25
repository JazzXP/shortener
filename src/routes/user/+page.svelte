<script lang="ts">
	import { enhance } from '$app/forms';
	import { Heading, Label, Input, Button, Alert, Helper } from 'flowbite-svelte';
	import type { SubmitFunction } from './$types';
	let errorMsg = $state('');
	let successMsg = $state('');
	const errorFields = $state({
		oldPassword: false,
		password: false,
		passwordConfirm: false,
		unknown: false
	});

	const onSubmit: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();

			if (result.type === 'failure') {
				successMsg = '';
				if (result.data?.incorrect || result.data?.missing) {
					errorMsg = `${result.data.incorrect ? 'Incorrect' : 'Missing'} Password`;
					errorFields.oldPassword = true;
					errorFields.password = false;
					errorFields.passwordConfirm = false;
					errorFields.unknown = false;
				} else if (result.data?.match) {
					errorMsg = 'Passwords should match';
					errorFields.oldPassword = false;
					errorFields.password = true;
					errorFields.passwordConfirm = true;
					errorFields.unknown = false;
				} else {
					errorMsg = 'Unknown error';
					errorFields.oldPassword = false;
					errorFields.password = false;
					errorFields.passwordConfirm = false;
					errorFields.unknown = true;
				}
			} else if (result.type == 'success') {
				successMsg = 'Updated successfully';
				errorMsg = '';
				errorFields.oldPassword = false;
				errorFields.password = false;
				errorFields.passwordConfirm = false;
				errorFields.unknown = false;
			}
		};
	};
</script>

{#snippet PasswordField(title: string, name: string, error: boolean | undefined)}
	{@const color = error ? 'red' : undefined}
	<Label for={name} {color}>{title}</Label>
	<Input type="password" {name} id={name} {color} />
	{#if error}
		<Helper {color}>
			<span class="font-medium">Error</span>
			{errorMsg}
		</Helper>
	{/if}
{/snippet}

<Heading tag="h2">Password</Heading>
<form class="max-w-md" use:enhance={onSubmit} method="POST">
	{@render PasswordField('Old Password', 'oldPassword', errorFields.oldPassword)}
	{@render PasswordField('Password', 'password', errorFields.password)}
	{@render PasswordField('Confirm Password', 'passwordConfirm', errorFields.passwordConfirm)}
	<Button type="submit" class="mt-4">Update Password</Button>
</form>
{#if errorFields.unknown}
	<Alert color="red">{errorMsg}</Alert>
{/if}
{#if successMsg.length !== 0}
	<Alert color="green">{successMsg}</Alert>
{/if}
