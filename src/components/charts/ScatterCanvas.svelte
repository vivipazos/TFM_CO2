<script>

	import Tooltip from '../common/Tooltip.svelte'
	import { Canvas } from 'svelte-canvas'
	import { extent } from 'd3-array'
	import { scaleLinear } from 'd3-scale'
    import { Delaunay } from 'd3-delaunay'
	import Square from './Square.svelte'


	export let data;
	export let step = 0;
	export let layout;
	export let width;
	export let height;


    let tooltipOptions;
	const margin = { top: 0, right: 0, bottom: 0, left: 0 }
	let picked = null, click = false;

	$:console.log('Sections! ', width, height)

  //	$: x = scaleLinear()
  //	 	.domain([0,100])
  //		.range([width*0.5185, width*0.8563])
  //	    .nice()

	$: y = scaleLinear()
					.domain([0,100])
					.range([margin.top, height])
					.nice()

$: delaunay = Delaunay.from(data, d => 0, d => y(d.coords[step].y) + y(d.coords[step].height) / 2)
</script>
<div class="{layout} absolute">
	<Canvas
		{width} {height}
		style='cursor: pointer'
		on:mousemove={({ offsetX: x, offsetY: y }) => {
					picked = delaunay.find(x, y);
					let tip = (data[picked].data[0]) ;
					tooltipOptions = {x: x, y: y, tip: tip, visible: true}
		}}
		on:mouseout={() => {
			picked = null
			tooltipOptions = {x: -1000, y: -1000, tip: '', visible: false}
		}}
		on:mousedown={() => click = true}
		on:mouseup={() => click = false}
	>

		{#each data as d, i}
				<Square
				x={width * 0.52}
				y={y(d.coords[step].y)}
				height={y(d.coords[step].height)}
				width={width * 0.34}
				stroke={i === picked ? "black" : "white"}
				lineWidth={i === picked ? 3 : 1}
			/>

		{/each}
	</Canvas>
	<Tooltip {... tooltipOptions} {width} {height} />
</div>

<style>
	.absolute {
		position: absolute;
		top: 0;
		left: 0;
		margin-left: calc((100vw - 450px) * (-0.5));
	}
</style>
