<script>
	import Budget from './components/Budget.svelte'
	import Actions from './components/Actions.svelte'
	import data from './data/test1.json'

	let data_modified = data.map(d => {
          d.active = false;
          d.shown = false;
          return d;
        })

	
</script>

<main>
	<Budget
		data = {data_modified}
	/>

	<Actions
		bind:value={data_modified}
	/>
</main>

<style>
	main {
		position: relative;
		padding: 1em;
		margin: 0 auto;
	}
	
</style>