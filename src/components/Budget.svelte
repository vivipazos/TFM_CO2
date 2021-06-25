<script>
import {scaleLinear} from 'd3-scale'
import InlineSVG from 'svelte-inline-svg';

export let carbon;
export let year;
export let widthV;
export let mark1;
export let limitbg;
export let mark1990;
export let mark2017;
export let mark2040;

const arrow = './images/arrow.svg';


</script>
{#if year}
<div style="--widthV: {widthV}" class="budgetBarYearly">
    <p class="year">Year: <b>{year}</b><br>{(carbon/1000).toFixed(2)} Gt CO&#x2082;</p>
    <!-- <p class="yearLimit">2040</p> -->
    <video autoplay muted loop>
        <source src="./smokeLong.mp4" type="video/mp4">
    </video>

<div id="1850-mark" class="mark" bind:this={mark1}>
    <div class="arrow3">
        <InlineSVG src={arrow}/>
    </div>
    <p >This <b>red smoke</b> is how much CO&#x2082; was in the atmosphere in 1850.
    </p>
</div>
<div id="2040-mark" class="mark2040" bind:this={mark2040}>
    <p >This is the <b>carbon limit</b>. We don't want to reach here.</p>
    <div class="arrow2040">
        <InlineSVG src={arrow}/>
    </div>
</div>
<div id="1990" class="mark1990" bind:this={mark1990}>
    <p ><b>1990</b></p>
</div>
<div id="2017" class="mark2017" bind:this={mark2017}>
    <p ><b>2017</b></p>
</div>
</div>
<div class="limit-bg" bind:this={limitbg}>
        <div class="carbon-budget-label">
            <span class="white-bg">Remaining</span><br>
            <span class="white-bg">carbon</span><br>
            <span class="white-bg">budget</span>
        </div>
        <hr class="small-line">
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
    .mark1990 {
        height: 60px;
        margin: 10px;
        position:absolute;
        top: 0;
        left: 48vw;
        z-index: 100;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
       
    }
    .mark2017 {
        height: 60px;
        margin: 10px;
        position:absolute;
        top: 0;
        left: 80vw;
        z-index: 100;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
       
    }

    .mark2040 {
        height: 60px;
        margin: 10px;
        width: 100px;
        position:absolute;
        top: 0;
        right: 1rem;
        z-index: 100;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
        top: 10vh;
       
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

    .arrow2040 {
        width:40px;
        transform: rotate(180deg);
        margin-left: 5rem;
        margin-top: -1rem;
    }

    .limit-bg {
        background-color:white;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAKElEQVQYV2NkwA58GbGI+zIwMGxGlwALghQjS8AFkSVQBGESGIIgCQBVnAVUPcxeHAAAAABJRU5ErkJggg==) repeat;
        left: calc(100% - 12.5vw);
        width:12.5vw;
        height:100vh;
        position: absolute;
        top: 0;
        transition: opacity 0.5s;
        border-bottom: 2px solid black;
    }

    .carbon-budget-label {
        bottom: 6px;
        position: absolute;
        font-size: 0.8rem !important;
        text-align:center;
        right: 10px; 
    }

    .white-bg {
        background-color: white;
        padding: 4px;
        line-height:1.2rem;
    }

    hr.small-line {
        border-top: 2px solid black;
        position: relative;
    }
</style>