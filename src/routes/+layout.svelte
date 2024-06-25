<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { CreateUrl } from '$lib/components';
	import { A, Heading, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { LinkOutline, UserOutline } from 'flowbite-svelte-icons';

	const {
		children,
		data
	}: {
		children: Snippet;
		data: LayoutData;
	} = $props();
	let activeUrl = $state('');
	$effect(() => {
		activeUrl = $page.url.pathname;
		console.log(activeUrl);
	});
</script>

<svelte:head>
	<title>URL Shortener</title>
</svelte:head>

{#if data.user}
	<Navbar fluid>
		<NavBrand href="/">
			<LinkOutline class="h-[8vw] w-[8vw] text-orange-600 md:h-12 md:w-12" color="currentColor" />
			<Heading class="text-[8vw] md:text-3xl lg:text-5xl">URL Shortener</Heading>
		</NavBrand>
		<!-- <div class="md:max-w-128 flex max-w-60 md:order-2 md:min-w-96"> -->
		<CreateUrl baseURL={data.baseURL} />
		<!-- </div> -->
		<NavHamburger />
		<NavUl {activeUrl}>
			<NavLi href="/user">
				<UserOutline class="inline-block" />
				{data.user}
			</NavLi>
			<NavLi href="/">Home</NavLi>
			{#if data.admin}
				<NavLi href="/admin/user">User manager</NavLi>
			{/if}
		</NavUl>
	</Navbar>
{/if}

<main class="max-w-3xl md:mx-4 md:p-2">
	{@render children()}
</main>
