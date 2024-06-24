<script lang="ts">
	import { goto, invalidateAll, preloadData, pushState } from '$app/navigation';
	import { CreateUser } from '$lib/components';
	// import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
	import {
		Button,
		Heading,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { CheckOutline } from 'flowbite-svelte-icons';

	const { data } = $props();
	const users = $derived.by(() => data.users.sort((a, b) => a.username.localeCompare(b.username)));

	async function preloadCreatePage() {
		const url = '/admin/user/create';
		const preloadedPage = await preloadData(url); // the argument is the relative route
		if (preloadedPage.type === 'loaded' && preloadedPage.status === 200) {
			pushState(url, { showModal: true });
		} else {
			goto(url);
		}
	}
</script>

<Heading>Admin Users</Heading>
<Table striped shadow>
	<TableHead>
		<TableHeadCell>Username</TableHeadCell>
		<TableHeadCell>Admin</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each users as user}
			<TableBodyRow>
				<TableBodyCell>
					{user.username}
				</TableBodyCell>
				<TableBodyCell>
					{#if user.admin > 0}
						<CheckOutline />
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
<Button
	class="mt-8"
	href="/admin/user/create"
	on:click={async (e) => {
		e.preventDefault();
		await preloadCreatePage();
	}}
>
	Create User
</Button>

<Modal
	open={$page.state.showModal}
	outsideclose
	size="sm"
	on:close={() => {
		if ($page.state.showModal) {
			history.back();
			invalidateAll();
		}
	}}
>
	<CreateUser formSubmit={() => history.back()} />
</Modal>
