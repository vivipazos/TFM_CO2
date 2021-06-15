<svelte:head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");
    </style>
</svelte:head>

<script>
	import Budget from './components/Budget.svelte'
	import Action from './components/Action.svelte'
	import Text from './components/common/Text.svelte'
	import Scroller from '@sveltejs/svelte-scroller';
	import Header from  './components/Header.svelte'
	import Footer from './components/Footer.svelte'
	
	import data from './data/data.json'
	import { loop_guard } from 'svelte/internal';
  
  	let offset, progress;
	$:index=index < 8 ? index:0 ;
	let visible = false;

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

	$: if ( progress > 0.7 && progress<0.9) {
		visible = true;
	}
	else {
		visible = false;
	}

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
					{data}
					{visible}
				/>
			</div>

			<div slot="foreground">
                {#each block.steps as step}
                    <section>
                        {#if visible === false}
                        <div class="scrollyText">
                            <p>{@html step.p}</p>
                        </div>
                        {/if} 
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
		padding-top: 20vh;
		width: 450px;
		margin: 0 auto;
		margin-left: 45%;
		font-family: 'Open Sans', sans-serif;
	}
	.scrollyText {
		background-color: hsl(0, 0%, 100%, 1);
		border-radius: 5px;
		padding: 20px;
		font-size: 18px;
		line-height: 25px;
	}

	:global(.firstPar) {
		font-size: 30px;
		line-height: 42px;
		font-weight: 700;
	}

	:global(.carbonDi) {
		background-color: rgb(207,25,25);
		border-radius: 6px;
		padding: 6px;
		color: #fff;
		font-weight: 400;
	}

	p {
		font-size: 22px;
		line-height: 28px;
		font-weight: 300;
	}

</style>