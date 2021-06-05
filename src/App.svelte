<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import data from './data/test1.json'

	let data_modified = data.map(d => {
          d.active = false;
          d.shown = false;
          return d;
        })

	function toggle () {
    	data.map(d => {
        d.active = d.active ? false : true;
        return d;
        })
    }

	$: console.log(data_modified)
</script>

<main>
	<Budget
		data = {data_modified}
	/>

{#each data_modified as object}
	<Action
		{toggle}
		{...object}
		bind:active={object.active}
	/>
{/each}

</main>

<style>
	main {
		position: relative;
		padding: 1em;
		margin: 0 auto;
	}
	
</style>