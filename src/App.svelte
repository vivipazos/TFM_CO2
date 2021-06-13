<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'
	import Yearly from './data/YearlyData.json'
	import Scroller from '@sveltejs/svelte-scroller';
	import { each } from 'svelte/internal';
  
  	let offset, progress;
	$:index=index < 170 ? index:170 ;

	export let content;
	export let actions;
	export let carbon;

	let data_modified = actions.map(d => {
          d.active = false;
          return d;
        })
</script>

<main>
	<Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
		<div slot="background">
			<Budget
				year = {Yearly[index].year}
				carbon = {Yearly[index].carbonDioxide}
				percentage = {Yearly[index].Percentage}
				widthV = {parseFloat(Yearly[index].Percentage).toFixed(2).toString() + "%"}
			/>
		</div>
	  
		<div slot="foreground">
			{#each Yearly as year}
				<section>{Yearly[index].year}</section>
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
		padding: 1em;
		margin: 0 auto;
	}

	section {
		height: 80vh; 
		text-align: center;
	}	
</style>