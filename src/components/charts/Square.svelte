<script>
	import { Layer } from 'svelte-canvas'
	import { tweened } from 'svelte/motion';
	import { quadOut, cubicOut } from 'svelte/easing';

	export let x = 0;
	export let y = 0;
	export let width = 1;
	export let height = 1;
	export let fill = "null";
	export let lineWidth = 1;
	export let text =""
	export let stroke= "white"

    const _x = tweened(x, { duration: 600, easing:quadOut});
    const _y = tweened(y, { duration: 600, easing:quadOut});
	const _width = tweened(width, { duration: 600, easing:cubicOut});
	const _height = tweened(height, { duration: 600, easing:cubicOut});
    $: _x.set(x);
    $: _y.set(y);
	$: _width.set(width);
	$: _height.set(height);

	$: render = ({ context }) => {
		context.fillStyle = fill;
		context.beginPath();
		context.lineWidth = lineWidth;
		context.strokeStyle= stroke 	
		if ( $_height>0) context.globalAlpha = 1;
		if ( $_height<0.0000001) context.globalAlpha = 0;
		context.rect($_x, $_y, $_width, $_height);
		context.stroke()
		if ( $_height>15) context.fillText(text, $_x+$_width/2, $_y+15/2+$_height/2)
		context.font = "15px Open Sans";
		context.fillStyle = "white";
        context.textAlign = "center";
	}
</script>

<Layer {render} priority={stroke && 1} />