<svelte:head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap");
    </style>
</svelte:head>

<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'
	import Yearly from './data/YearlyData.json'
	import Scroller from '@sveltejs/svelte-scroller';
	import { each } from 'svelte/internal';

  	let offset, progress;
	$:index=index < 8 ? index:0 ;

	export let content;
	export let actions;
	export let carbon;

/* 	let groupedData = actions.reduce(function(acumarray, d) {
    	(acumarray[d.category] = acumarray[d.category] || []).push(d);
    	return acumarray;
  	}, {}); */


	let carbon_modi = carbon.map(d => {
          d.year = parseFloat(d.year);
		  d.carbonDioxide = parseFloat(d.carbonDioxide);
		  d.Percentage = parseFloat(d.Percentage);
          return d;
        })

	let selected_data = carbon_modi.filter(function (sely) {
        return sely.year === 1850 || sely.year === 1900 || sely.year === 1960 || sely.year === 2000 || sely.year === 2020 ;
    });

	let data_modified = actions.map(d => {
          d.active = false;
          return d;
        })
</script>

<main>
	<Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
		<div slot="background">
			<Budget
				year = {index > 4
					? selected_data[4].year
					:selected_data[index].year}
				carbon = {index > 4
					? (selected_data[4].carbonDioxide/1000).toFixed(2)
					:(selected_data[index].carbonDioxide/1000).toFixed(2)}
				percentage = {index > 4
					? selected_data[4].Percentage
					:selected_data[index].Percentage}
				widthV = {index > 4
					? parseFloat(selected_data[4].Percentage).toFixed(2).toString() + "%"
					:parseFloat(selected_data[index].Percentage).toFixed(2).toString() + "%"}
			/>
		</div>
	  
		<div slot="foreground">
				<section>
					<div class="scrollyText">
						We are speeding on a highway to hell ...and we need to <b>slow down</b>.
					</div>
				</section>
				<section>
					<div class="scrollyText">
					Human activity is increasing the amount of CO2 in the atmosphere.
					</div>
				</section>
				<section>
					<div class="scrollyText">The more CO2, the more global warming.
					</div>
				</section>
				<section><div class="scrollyText">By current estimates, we people have emitted about 2200 Gt of CO2 in the atmosphere. This amounts to almost 1oC of global warming already.</div></section>
				<section>
					<div class="scrollyText">Where has all that CO2 come from? Most of it have been direct emissions from fossil fuel combustion, all type or energy production, and industrial processes.</div>
				</section>
				<section>
					<div class="scrollyText">Those were just the direct emissions. There is also CO2 accumulating resulting from deliberate human activities on land, including those leading to land-use change.</div>
				</section>
				<section>
					<div class="scrollyText">At the current speed of increase, global warming will reach 1.5oC by 2040</div>
				</section>
				<section>
					<div class="scrollyText">We ought to slow this down. Check the impacts of some actions we can take:</div>
				</section>
			<!-- {/each} -->
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
		font-family: 'Open Sans', sans-serif;
	}

	section {
		height: 80vh; 
		text-align: left;
		padding-top: 50vh;
		width: 400px;
		margin: 0 auto;
		font-family: 'Open Sans', sans-serif;
	}

	.scrollyText {
		background-color: hsl(0, 0%, 100%, 1);
		border-radius: 5px;
		padding: 20px;
		font-size: 18px;
		line-height: 25px;
	}

</style>