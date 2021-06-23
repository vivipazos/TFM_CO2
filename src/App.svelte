<script>
	import Budget from './components/Budget.svelte';
	import BudgetActions from './components/BudgetActions.svelte';
	import Action from './components/Action.svelte';
	import Text from './components/common/Text.svelte';
	import Scroller from '@sveltejs/svelte-scroller';
	import Header from  './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Sections from './components/Sections.svelte';

	import { MaterialApp, Icon, Button } from 'svelte-materialify';
	import { mdiRefresh } from '@mdi/js';

	import InlineSVG from 'svelte-inline-svg';

	const transitionArrow = './images/transitionArrow.svg';

	import data from './data/data.json'

  	let offset, progress;
	$:index=index < 10 ? index:0 ;

	export let content;
	export let actions;
	export let carbon;

	let budgetActions;

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
		  d.amount = +d.amount_all
          return d;
        })

	$: numDatapoints = carbon_modi.length - 1;
	$: actualProgress = Math.min(progress, 0.5) / 0.5;
	$: currentIndex = Math.floor(Math.min(1, Math.max(actualProgress ||0, 0)) * numDatapoints);
	$: currentDatapoint = carbon_modi[currentIndex];

	// Toggle CSS displays

	$:mark1 = null
	$:limitbg = null
	$:mark1990 = null
	$:mark2017 = null
	$:mark2040 = null
	
	$:if (mark1 !== null) {
	if (progress < 0.3) { 
		mark1.style.opacity = 1; 
	} else {
		mark1.style.opacity = 0;
	}
	}

	$:if (limitbg !== null) {
	if (progress < 0.99) {
		limitbg.style.opacity = 0;
	} else {
		limitbg.style.opacity = 1;
	}
	}
	$:if (mark1990 !== null) {
	if (progress > 0.8 && progress < 0.9 ) {
		mark1990.style.opacity = 1;
	} else {
		mark1990.style.opacity = 0;
	}
	}
	$:if (mark2017 !== null) {
		if (progress > 0.8  && progress < 0.9 ) {
		mark2017.style.opacity = 1;
	} else {
		mark2017.style.opacity = 0;
	}
	}
	$:if (mark2040 !== null) {
		if (progress > 0.7  && progress < 0.99 ) {
		mark2017.style.opacity = 1;
	} else {
		mark2017.style.opacity = 0;
	}
	}

	function resetActions() {
		budgetActions.reset();
		actions.forEach(a => a.active = false);
		actions = actions; // triggers svelte re-render
	}

</script>

<svelte:head>
<style>
    @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");
</style>
</svelte:head>

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
					bind:mark1 = {mark1}
					bind:limitbg = {limitbg}
					bind:mark1990 = {mark1990}
					bind:mark2017 = {mark2017}
					bind:mark2040 = {mark2040}
				/>
			</div>

			<div slot="foreground">
                {#each block.steps as step}
					<section class="step step-{step.type}">
						{#if step.type === 'textbox'}
							<div class="scrollyText">
								<p>{@html step.p}</p>
							</div>
						{:else if step.type === 'sections'}
							<Sections {data}/>
						{:else if step.type === 'textbox-blank'}
						<div class="scrollyText textbox-blank">
							<p>{@html step.p}</p>
						</div>
						{/if}
					</section>
                {/each}
            </div>
		</Scroller>

	
	{:else if block.type === 'transition'}
	<div class=transitionBox>
		{#each block.text as p}
				<h4><span class="transition-space">{@html p.p}</span></h4>
		{/each}
		<div class="transitionArrow">
			<InlineSVG src={transitionArrow}/>
		</div>
	</div>

	{:else if block.type === 'calculator'}
	<div class="calc">
		<BudgetActions
			bind:this={budgetActions}
			action = {data_modified}
			{carbon}
		/>

	<div class="calc-header">
		<MaterialApp>
			<div class="d-flex flex-column flex-sm-row justify-space-between">
				<Button outlined on:click={resetActions}>
					<Icon path={mdiRefresh} />
					&#xa0;Reset
				</Button>
			</div>
		</MaterialApp>
	</div>
		{#each actions as object}
			<Action
			{...object}
			bind:active = {object.active}
			onChange = {() => data_modified = data_modified }
		/>
		{/each}
	</div>

	{:else if block.type === 'footer'}
		<Footer>
			<div slot="about">
				{#each block.about as text}
				{@html text.p}
				{/each}
			</div>
			<div slot="team">
				{#each block.team as text}
				{@html text.p}
				{/each}
			</div>
			<div slot="data">
				{#each block.data as text}
				{@html text.p}
				{/each}
			</div>
			<div slot="disclaimer">
				{#each block.disclaimer as text}
				{@html text.p}
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

	/* .step-sections {
		height: 300vh;
	} */

	.step {
		pointer-events: all;
	}
	.step-sections > :global(*) {
		position: sticky;
		top: 5vh;
		z-index: 100;
	}

	section {
		height: 80vh;
		text-align: left;
		padding-top: 20vh;
		width: 450px;
		margin: 0 auto;
		font-family: 'Open Sans', sans-serif;
	}
	:global(.scrollyText) {
		background-color: hsl(0, 0%, 100%, 0.9);
		border-radius: 5px;
		padding: 1rem;
		font-size: 15px;
		box-shadow: 1rem 1rem 1rem -1rem #00000033;
	}

	:global(.firstPar) {
		font-size: 2.4rem;
		font-weight: 700;
	}

	:global(.carbonDi) {
		background-color: rgb(225,29,41);
		border-radius: 3px;
		padding: 6px 6px 10px 6px;
		color: #fff;
		font-weight: 700;
	}

	:global(.carbonDi-inline) {
		font-weight: 900;
		color: rgb(225,29,41);
	}

	:global(svelte-scroller-foreground) {
		pointer-events: none;
	}

	:global(.textbox-blank){
		display: none;
	}

	:global(.transitionBox){
		padding: 25vh 0 5vh 0;
		margin: 0 auto;
		width: 500px;
		text-align: left;
		height: 480px;
	}

	/* Arrow */
	:global(.transitionArrow) {
		position: relative;
		left: 100%;
		top: -25vh;

    }

	:global(.transition-space){
		line-height: 1.5rem;
	}

	:global(.calc-header){
		width: 20px;
		margin-left: 1rem;
		padding: 1rem;

	}

</style>