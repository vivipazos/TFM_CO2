<svelte:head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap");
    </style>
</svelte:head>

<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'
	import Scroller from '@sveltejs/svelte-scroller';
	import Header from  './components/Header.svelte'
	import Footer from './components/Footer.svelte'

  	let offset, progress;
	$:index=index < 8 ? index:0 ;
	$: console.log(index)

	export let content;
	export let actions;
	export let carbon;

	let carbon_modi = carbon.map(d => {
          d.year = parseFloat(d.year);
		  d.carbonDioxide = parseFloat(d.carbonDioxide);
		  d.Percentage = parseFloat(d.Percentage);
          return d;
        })

	let selected_data = carbon_modi.filter(function (sely) {
        return sely.year === 1850 || sely.year === 1900 || sely.year === 1960 || sely.year === 2000 || sely.year === 2020 ;
    });

	console.log(selected_data)

	let data_modified = actions.map(d => {
          d.active = false;
          return d;
        })

	$: numDatapoints = carbon_modi.length - 1;
	$: actualProgress = Math.min(progress, 0.5) / 0.5;
	$: currentIndex = Math.floor(Math.min(1, Math.max(actualProgress ||0, 0)) * numDatapoints);
	$: currentDatapoint = carbon_modi[currentIndex];
</script>

<main>
{#each content as block}

	{#if block.type === 'head'}
		<Header {...block}/>

	{:else if block.type === 'text'}
		<Text {...block} />

	{:else if block.type === 'scroller'}

		<Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
			<div slot="background">
				<Budget
					year = {currentDatapoint.year}
					carbon = {currentDatapoint.carbonDioxide}
					percentage = {index > 4
						? selected_data[4].Percentage
						:selected_data[index].Percentage}
					widthV = {parseFloat(currentDatapoint.Percentage).toFixed(2).toString() + "%"}
				/>
			</div>

			<div slot="foreground">
				{#each block.steps as step}
					<section>
						<div class="scrollyText">
							<h4>{@html step.p}</h4>
						</div>
					</section>
				{/each}
			</div>
		</Scroller>

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

	{:else if block.type === 'footer'}
		<Footer>
			<div slot="about">
				{#each block.about as text}
				{text.p}
				{/each}
			</div>
			<div slot="data">
				{#each block.data as text}
				{text.p}
				{/each}
			</div>
			<div slot="disclaimer">
				{#each block.disclaimer as text}
				{text.p}
				{/each}
			</div>

		</Footer>
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