<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'

	export let content;
	export let actions;
	export let carbon;

	let data_modified = actions.map(d => {
          d.active = false;
          return d;
        })
	
	$:console.log(data_modified);
</script>

<main>
	{#each content as block}

	{#if block.type === 'text'}
		<Text {...block} />
	{:else if block.type === 'scroller'}
	<div></div>
	{:else if block.type === 'calculator'}
	<Budget
		action = {data_modified}
		{carbon}
	/>
	{#each actions as object}
		<Action
			{...object}
			bind:active = {object.active}
			onChange = {() => data_modified = data_modified }
		/>
	{/each}
	{/if}
	{/each}
</main>

<style>
	main {
		position: relative;
		padding: 1em;
		margin: 0 auto;
	}

	
	
</style>