<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { CreateUrl } from '$lib/components';
	import { A, Heading, NavLi, NavUl, Navbar } from 'flowbite-svelte';

	const {
		children,
		data
	}: {
		children: Snippet;
		data: LayoutData;
	} = $props();
</script>

<Navbar>
	<NavUl>
		<NavLi>
			<A href="/">Home</A>
		</NavLi>
		{#if data.admin}
			<NavLi>
				<A href="/admin/user">User manager</A>
			</NavLi>
		{/if}
	</NavUl>
	<CreateUrl baseURL={data.baseURL}></CreateUrl>
	<Heading tag="h5" class="inline-block w-auto"
		><A href="/user" class="text-slate-600">{data.user}</A></Heading
	>
</Navbar>

<main class="mx-4 max-w-3xl p-2">
	{@render children()}
</main>
