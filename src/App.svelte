<script>
	import Budget from './components/Budget.svelte';
	import BudgetActions from './components/BudgetActions.svelte';
	import Action from './components/Action.svelte';
	import Text from './components/common/Text.svelte';
	import Scroller from '@sveltejs/svelte-scroller';
	import Header from  './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import Sections from './components/Sections.svelte';

	import InlineSVG from 'svelte-inline-svg';
	const arrow = './images/arrow.svg';

	import data from './data/data.json'

  	let offset, progress;
	$:index=index < 10 ? index:0 ;

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

	$:if (actualProgress > 0.3) { 
		let firstMark = document.getElementById("1850-mark")
		firstMark.style.display = "none"; 
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
		{#each block.text as p}
			<div class=transitionBox>
				<h4>{@html p.p}</h4>
			<div class="arrow">
				<InlineSVG src={arrow}/>
			</div>
			</div>
		{/each}
	
	{:else if block.type === 'calculator'}
	<div class="calc">
		<BudgetActions
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
		background-color: hsl(0, 0%, 100%, 1);
		border-radius: 5px;
		padding: 14px;
		font-size: 15px;
	}

	:global(.firstPar) {
		font-size: 30px;
		line-height: 42px;
		font-weight: 700;
	}

	:global(.carbonDi) {
		background-color: rgb(225,29,41);
		border-radius: 6px;
		padding: 4px;
		color: #fff;
		font-weight: 700;
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
	}

	/* Arrow */
	:global(.arrow) {
        width:40px;
        transform: rotate(275deg);
		transform: scaleY(-1);

    }

</style>