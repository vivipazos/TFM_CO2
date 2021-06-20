<script>
import {scaleLinear} from 'd3-scale'
import InlineSVG from 'svelte-inline-svg';

export let carbon;
export let year;
export let widthV;
export let mark1;
export let limitbg;

const arrow = './images/arrow.svg';


</script>
{#if year}
<div style="--widthV: {widthV}" class="budgetBarYearly">
    <p class="year">Year: <b>{year}</b><br>{(carbon/1000).toFixed(2)} Gt CO&#x2082;</p>
    <!-- <p class="yearLimit">2040</p> -->
    <video title= "The width of the red is the accumulated emissions. There is some uncertainty in the numbers, that is why the edge is not precisely defined" autoplay muted loop>
        <source src="./smokeLong.mp4" type="video/mp4">
    </video>

<div id="1850-mark" class="mark" bind:this={mark1}>
    <div class="arrow3">
        <InlineSVG src={arrow}/>
    </div>
    <p title= "1850 represents the mid 1800s period, when industrial revolution kick in strong. It is also taken as the reference year for historical human-made emissions">
        In <b>1850</b> we started with <br> 7.23 Gt CO&#x2082; in the atmosphere.
    </p>
</div>
</div>
<div class="limit-bg" bind:this={limitbg}>
        <div class="carbon-budget-label">
            <span class="white-bg">Remaining</span><br>
            <span class="white-bg">carbon</span><br>
            <span class="white-bg">budget</span>
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
        width: 130px;
        display: block;
        transition: opacity 0.5s;
       
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
        left: calc(var(--widthV) - 2vw);
        object-fit: fill;
        offset: 0 0 0 3em;
        pointer-events: all;
    }

/* Arrow */
    .arrow3 {
        width:40px;
    }

    .limit-bg {
        background-color:white;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAKElEQVQYV2NkwA58GbGI+zIwMGxGlwALghQjS8AFkSVQBGESGIIgCQBVnAVUPcxeHAAAAABJRU5ErkJggg==) repeat;
        left:80vw;
        width:20vw;
        height:100vh;
        position: absolute;
        top: 0;
        transition: opacity 0.5s;
    }

    .carbon-budget-label {
        bottom: 6px;
        position: absolute;
        padding: 5px;
        margin: 6px 5vw;
        font-size: 0.8rem !important;
        text-align:center;
    }

    .white-bg {
        background-color: white;
        padding: 4px;
        line-height:1.2rem;
    }

</style>