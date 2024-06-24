<script lang="ts">
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		A,
		Heading
	} from 'flowbite-svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	const { data } = $props();

	let sortKey: 'url' | 'shortName' = $state('url');
	let sortDirectionUp: boolean | undefined = $state(undefined);
	const sortTable = (key: 'url' | 'shortName') => {
		// If the same key is clicked, reverse the sort direction
		if (sortKey === key) {
			sortDirectionUp = !(sortDirectionUp ?? true);
		} else {
			sortKey = key;
			sortDirectionUp = true;
		}
	};

	const sorted = $derived.by(() => {
		const key = sortKey;
		const direction = sortDirectionUp ?? false;
		const sorted = [...data.links].sort((a, b) => {
			const aVal = a[key].replace('https://', '').replace('http://', '');
			const bVal = b[key].replace('https://', '').replace('http://', '');
			if (aVal > bVal) {
				return !direction ? -1 : 1;
			} else if (aVal > bVal) {
				return direction ? -1 : 1;
			}
			return 1;
		});
		return sorted;
	});

	let search = $state('');
	let filtered = $derived.by(() =>
		sorted.filter((val) => val.url.toLowerCase().includes(search.toLowerCase()))
	);
</script>

{#snippet SortArrow(sortName: string, sortDirection: boolean)}
	{#if sortName === sortKey}
		{#if sortDirection}
			<AngleDownOutline class="inline-block" />
		{:else}
			<AngleUpOutline class="inline-block" />
		{/if}
	{/if}
{/snippet}

<div>
	<Heading tag="h2">Links</Heading>

	<TableSearch striped placeholder="Search Link" bind:inputValue={search} shadow>
		<TableHead>
			<TableHeadCell on:click={() => sortTable('url')}>
				URL {@render SortArrow('url', sortDirectionUp ?? false)}
			</TableHeadCell>
			<TableHeadCell on:click={() => sortTable('shortName')}>
				Shortened {@render SortArrow('shortName', sortDirectionUp ?? false)}
			</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each filtered as link (link.shortName)}
				{@const shortLink = `${data.baseURL}/${link.shortName}`}
				<TableBodyRow>
					<TableBodyCell><A href={link.url} target="_blank">{link.url}</A></TableBodyCell>
					<TableBodyCell><A href={shortLink} target="_blank">{shortLink}</A></TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</div>
