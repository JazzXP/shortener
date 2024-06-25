<script lang="ts">
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { A, Alert, Button, ButtonGroup, Input } from 'flowbite-svelte';
	import { CompressOutline } from 'flowbite-svelte-icons';

	let urlField: HTMLInputElement | undefined = $state();
	let errorMsg = $state('');
	let newLink = $state('');

	const { baseURL }: { baseURL: string } = $props();

	const onSubmit: SubmitFunction = () => {
		return async ({ update, result }) => {
			if (result.type !== 'error') {
				await update();
			}
			if (result.type === 'error') {
				errorMsg = result.error.message;
				if (urlField) urlField.value = '';
			} else if (result.type == 'success') {
				newLink = `${baseURL}/${result?.data?.url?.shortName ?? ''}`;
			}
		};
	};
</script>

<form
	method="POST"
	use:enhance={onSubmit}
	action={`/create`}
	class="md:max-w-128 relative max-w-60 sm:max-w-48"
>
	<ButtonGroup>
		<Input let:props required class="lg:min-w-96 ">
			<input
				{...props}
				bind:this={urlField}
				type="text"
				id="url"
				name="url"
				placeholder="URL to shorten"
				onkeypress={() => (errorMsg = '')}
			/>
		</Input>
		<Button type="submit" color="primary">
			<CompressOutline /><span class="ml-2 hidden lg:inline">Shorten</span>
		</Button>
	</ButtonGroup>
	{#if errorMsg.length > 0}
		<div transition:fly={{ y: -200 }} class="absolute top-12 w-full">
			<Alert color="red" class="p-2">
				{errorMsg}
			</Alert>
		</div>
	{/if}
	{#if newLink.length > 0}
		<div transition:fly={{ y: -200 }} class="absolute top-12 w-full">
			<Alert color="green" class="p-2">
				New link created: <A href={newLink} target="_blank">{newLink}</A>
			</Alert>
		</div>
	{/if}
</form>
