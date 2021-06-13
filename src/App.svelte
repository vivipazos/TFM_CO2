<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'
	import Yearly from './data/YearlyData.json'
	import Scroller from '@sveltejs/svelte-scroller';
	import { each } from 'svelte/internal';
  
  	let offset, progress;
	$:index=index < 5 ? index:0 ;

	console.log(Yearly)

	export let content;
	export let actions;
	export let carbon;

	
	let selected_data = Yearly.filter(function (sely) {
        return sely.year === 1850 || sely.year === 1900 || sely.year === 1960 || sely.year === 2000 || sely.year === 2018 ;
    });

	console.log(selected_data)

	let data_modified = actions.map(d => {
          d.active = false;
          return d;
        })
</script>

<main>
	<Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
		<div slot="background">
			<Budget
				year = {selected_data[index].year}
				carbon = {selected_data[index].carbonDioxide}
				percentage = {selected_data[index].Percentage}
				widthV = {parseFloat(selected_data[index].Percentage).toFixed(2).toString() + "%"}
			/>
		</div>
	  
		<div slot="foreground">
			{#each selected_data as year}
				<section>This is the year {selected_data[index].year}</section>
			{/each}
		</div>
	</Scroller>
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
		padding: 0;
		margin: 0 auto;
	}

	section {
		height: 80vh; 
		text-align: center;
		padding-top: 50vh;
	}	
</style>