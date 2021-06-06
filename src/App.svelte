<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'
	import data from './data/test1.json'

	export let content;
	export let actions;

	let data_modified = actions.map(d => {
          d.active = false;
          d.shown = false;
          return d;
        })
	
	console.log(actions)
</script>

<main>
	{#each content as block}

	{#if block.type === 'text'}
		<Text {...block} />
	{:else if block.type === 'scroller'}
	<div></div>
	{:else if block.type === 'calculator'}
	<Budget
		data = {data_modified}
	/>
	{#each actions as object}
		<Action
			{...object}
			bind:active = {object.active}
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