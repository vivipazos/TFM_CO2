<script>
	import Budget from './components/Budget.svelte'


	
</script>

<main>

	<Budget
	/>
	<Multiline 
		data={weather2}
		title='Title' desc='Description'
		key={{x: 'time', y: ['ny1', 'sf1', 'au1']}}
		{format}
		color={['#fc0', '#036', '#f0c']}
		layout='col'
	/>

	<Line 
		data={weather}
		title='Title' desc='Description'
		key={{x: 'time', y: 'value'}}
		{format}
		{color}
		layout='col'
	/>

	<Sankey
		data={sankeydata}
		colorNodes={d => '#00bbff'}
		colorLinks={d => '#00bbff35'}
		layout='col'
	/>

	<Area 
		data={weather}
		title='Title' desc='Description'
		key={{x: 'time', y: 'value'}}
		{format}
		{color}
		layout='col'
	/>

	<div class='col'>
		<p>This is an example of how you can do smooth transitions. It uses canvas so you can do a few thousand elements. Instead of the buttons triggering which step is in view, you can use the scroll ...  </p>
		<button on:click={() => scatterStep = 0}>Arrange like so</button>
		<button on:click={() => scatterStep = 1}>Rearrange again</button>
	</div>
	<ScatterCanvas
		data={points}
		layout='wide'
		step={scatterStep}
		mark='square'
	/>

	<div class='col'>
		<p>This is an example of how you can do smooth transitions. It uses canvas so you can do a few thousand elements. Instead of the buttons triggering which step is in view, you can use the scroll ...  </p>
		<button on:click={() => otherStep = 0}>Arrange like so</button>
		<button on:click={() => otherStep = 1}>Rearrange again</button>
	</div>
	<ScatterCanvas
		data={otherPoints}
		layout='wide'
		step={otherStep}
		mark='circle'
	/>

	<Bars 
		data={weather}
		title='Title' desc='Description'
		key={{x: 'time', y: 'value'}}
		{color}
		layout='col'
	/>

	<Scatter 
		data={weather3}
		title='Title' desc='Description'
		key={{x: 'pressure', y: 'temperatureHigh', size:'moonPhase'}}
		{format}
		{color}
		layout='col'
	/>
	
	<!-- <Scroller top={0} bottom={1} bind:index bind:offset bind:progress>
	<div slot="background">
		<Mapbox 
			options={
				{style:'mapbox://styles/fndvit/ckc1oqzq94nh91imn76jqxcha',
				scrollZoom:false,
				center: [-7.889722,42.782222],
				zoom: 6.5}
			}
			steps={steps}
			index={index}
			accessToken='pk.eyJ1IjoiZm5kdml0IiwiYSI6ImNrYzBzYjhkMDBicG4yc2xrbnMzNXVoeDIifQ.mrdvw_7AIeOwa5IgHLaHJg'
			layout='fs'
		/>
	</div>
	<div slot="foreground">
		<section><p class='col'>This is the first section.</p></section>
		<section><p class='col'>This is the second section.</p></section>
		<section><p class='col'>This is the third section.</p></section>
	</div>
	</Scroller> -->

	<Map 
		data={cases.data}
		map={world}
		geo='countries'
		scale={palette()}
		projection={projection}
    	join={{data:'geoid', map:'alpha3'}}
    	value='latest.cases'
    	legend={{title: '', format: ''}}
		layout='wide'
	/>
	
</main>

<style>
	main {
		padding: 1em;
		margin: 0 auto;
	}

	:global(.graphic) {
		height:50vh;
		margin-bottom:3rem;
	}
	
	[slot="foreground"] {
		pointer-events: none;
	}
	
	[slot="foreground"] section {
		pointer-events: all;
	}
	
	section {
		height: 80vh;
		padding: 1em;
		margin: 0 0 2em 0;
	}

</style>