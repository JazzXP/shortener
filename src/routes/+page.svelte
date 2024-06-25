<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		A,
		Heading,
		Card,
		Input,
		Button,
		Listgroup,
		ListgroupItem,
		P,
		ButtonGroup
	} from 'flowbite-svelte';
	import {
		AngleDownOutline,
		AngleUpOutline,
		ClipboardOutline,
		SearchOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';

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
	<Heading tag="h2" class="m-2">Links</Heading>

	<div class="hidden md:block">
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
						<TableBodyCell>
							<A href={link.url} class="truncate" target="_blank">{link.url}</A>
						</TableBodyCell>
						<TableBodyCell class="flex justify-between">
							<A href={shortLink} class="truncate" target="_blank">{shortLink}</A>
							<form method="POST" use:enhance>
								<input type="hidden" name="link" id="link" value={link.shortName} />
								<ButtonGroup>
									<Button color="alternative" class="p-2" type="submit">
										<TrashBinOutline />
									</Button>
									<Button
										color="alternative"
										class="p-2"
										on:click={(e) => {
											e.preventDefault();
											navigator.clipboard.writeText(shortLink);
										}}
									>
										<ClipboardOutline />
									</Button>
								</ButtonGroup>
							</form>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	</div>
	<div class="block p-1 md:hidden">
		<Card>
			<Input class="w-full" placeholder="Search" let:props>
				<input type="text" {...props} bind:value={search} />
				<SearchOutline slot="left" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
			</Input>
			<Listgroup>
				{#each filtered as link (link.shortName)}
					{@const shortLink = `${data.baseURL}/${link.shortName}`}
					<ListgroupItem>
						<div class="flex min-w-1 justify-between">
							<A href={shortLink} class="mr-4 flex w-full min-w-1 flex-1 flex-col items-start">
								<P
									size="xs"
									whitespace="nowrap"
									class="min-w-1 max-w-full flex-1 truncate [direction:rtl]"
								>
									<bdi>{link.url}</bdi>
								</P>
								<span class="min-w-1 max-w-full flex-1 truncate" style:direction="rtl">
									<bdi>{shortLink}</bdi>
								</span>
							</A>
							<form method="POST" use:enhance class="flex-none">
								<input type="hidden" name="link" id="link" value={link.shortName} />
								<ButtonGroup>
									<Button color="alternative" class="p-2" type="submit">
										<TrashBinOutline />
									</Button>
									<Button
										color="alternative"
										class="p-2"
										on:click={(e) => {
											e.preventDefault();
											navigator.clipboard.writeText(shortLink);
										}}
									>
										<ClipboardOutline />
									</Button>
								</ButtonGroup>
							</form>
						</div>
					</ListgroupItem>
				{/each}
			</Listgroup>
		</Card>
	</div>
</div>
