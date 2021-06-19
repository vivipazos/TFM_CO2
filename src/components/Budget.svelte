<script>
import {scaleLinear} from 'd3-scale'
import InlineSVG from 'svelte-inline-svg';

export let carbon;
export let year;
export let widthV;

const arrow = './images/arrow.svg';


</script>
{#if year}
<div style="--widthV: {widthV}" class="budgetBarYearly">
    <p class="year">Year: <b>{year}</b><br>{(carbon/1000).toFixed(2)} Gt CO&#x2082;</p>
    <!-- <p class="yearLimit">2040</p> -->
    <video title= "The width of the red is the accumulated emissions. There is some uncertainty in the numbers, that is why the edge is not precisely defined" autoplay muted loop>
        <source src="./smoke6.mp4" type="video/mp4">
    </video>

<div id="1850-mark" class="mark">
    <div class="arrow3">
        <InlineSVG src={arrow}/>
    </div>
    <p title= "1850 represents the mid 1800s period, when industrial revolution kick in strong. It is also taken as the reference year for historical human-made emissions">
        In <b>1850</b> we started with <br> 7.23 Gt CO&#x2082; in the atmosphere.
    </p>
</div>

</div>
{/if}

<style>

    @keyframes grow {
        from {
            width:0vw;
        }
        to {
           width:100vw;
        }
    }

    .budgetBarYearly {
        top: 0;
        left: 0;
		margin: 0;
        background-color: rgb(225,29,41);
        width: var(--widthV);
        height: 100vh;
	}

    .year {
        height: 60px;
        margin: 10px;
        position:absolute;
        top: 0;
        left: var(--widthV);
        z-index: 100;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
    }
    .mark {
        height: 60px;
        margin: 10px;
        position:absolute;
        top: 10vh;
        z-index: 99;
        border-left: 1px thick white;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
        pointer-events: all;
        animation: 3s fadeIn;
        animation-fill-mode: forwards;
        width: 130px;
        display: block;
       
    }
    @keyframes fadeIn {
    99% {
        visibility: hidden;
    }
    100% {
        visibility: visible;
        }
    }

    b {
        font-weight: 600;
    }

    video {
        position: absolute;
        height: 100vh;
        width: 15vw;
        left: calc(var(--widthV) - 0vw);
        object-fit: fill;
        offset: 0 0 0 3em;
        pointer-events: all;
    }

    /* Arrow */
    .arrow3 {
        width:40px;
    }

</style>