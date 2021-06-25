<script>

	import Tooltip from '../common/Tooltip.svelte'
	import { Canvas } from 'svelte-canvas'
	import { scaleLinear } from 'd3-scale'
    import { Delaunay } from 'd3-delaunay'
	import Square from './Square.svelte'

	export let data;
	export let step = 0;
	export let layout;
	export let width;
	export let height;
	
    let tooltipOptions;	
	let picked = null, click = false

	let margin = { top: 0, right: 0, bottom: 80, left: 0 }

	$: y = scaleLinear().domain([0,100]).range([margin.top, height-margin.bottom])

	$: delaunay = Delaunay.from(data, d =>0, d => y(d.coords[step].y)  +  y(d.coords[step].height)/2 )

</script>

<div class=" {layout} absolute"  >
	<Canvas
		{width} {height}
		style='cursor: pointer'
		on:mousemove={({ offsetX: x, offsetY: y }) => 	{ picked = delaunay.find(x, y);	
														let tip =  ( data[picked].data[0] ) ;														
														tooltipOptions = {x: x, y: y, tip: tip, visible: (data[picked].coords[step].height>0)?true:false } 
					}}
		on:mouseout={() => {picked = null
							tooltipOptions = {x: -5000, y: -5000, tip: '', visible: false}
					}}
		on:mousedown={() => click = true}
		on:mouseup={() => click = false}
	>

		{#each data as d, i}
		   
		  
				<Square
				x={width * 0.515}
				y={y(d.coords[step].y)}
				height={y(d.coords[step].height)}
				width={width * 0.335}
				stroke={i === picked ? "white" : "white"}
				lineWidth={i === picked ? 3 : 0.2}
				text={d.data[0]}
				/>
			

			
		{/each}
	</Canvas>
	<Tooltip {... tooltipOptions} {width} {height} />
</div>


<style>
	.absolute {
		position: absolute;
		top: 0vw;
		left: 0;
		margin-left: calc((100vw - 450px) * (-0.52));
	}
</style>

