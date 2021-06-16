<script>
import Sections from './Sections.svelte'
export let action
export let carbon

export let year
export let percentage
export let widthV

export let visible
export let data

let baseValue = 17000; //Mt CO2, constant yearly increase if nothing done
let carbonLimit  = 2721042; //Mt CO2, the amount at the edge of the allowed budget before reaching 1.5 degrees

/*
let circles = new Array(40).fill()
	.map(a => ({
		x: Math.random(),
		y: Math.random(),
        r: 8
	}));

$: if(percentage)
{widthV = percentage.toFixed(2).toString() + "%"}
*/

$:console.log(action) //This is working and showing the active "action"

/* $:selectedAction = action.filter(d => d.active)
    .map(d => +d.amount_all)
    .reduce((a,c) => a + c, 0)  */

// $:console.log(selectedAction)

/* $:modifiedValue = baseValue - selectedAction

$:console.log(modifiedValue)

let lastValue = carbon[carbon.length - 1]

console.log(lastValue) */

</script>
{#if year}
<div style="--widthV: {widthV}" class="budgetBarYearly">
    <hr class="vertical" />
    <p class="year"><b>{year}</b><br>{(carbon/1000).toFixed(2)} Gt CO&#x2082;</p>
    <!-- <p class="yearLimit">2040</p> -->
    <video autoplay muted loop>
        <source src="./smoke_edge_loop.mp4" type="video/mp4">
    </video>

<div class="mark">
        <p title= "This is a reference year"><b>1850</b><br> 7.23 Gt CO&#x2082;</p>
</div>


<!--     <svg class="dangerZone" viewBox="0 0 {width} {height}">
            <g>
                {#each circles as d}
                <circle cx={d.x} cy={d.y} r={d.r} fill={d.color}/>
                {/each}
            </g>
    </svg> -->
</div>
{/if}

<!--  <div class="budgetBar">

 </div> -->


<style>
	.budgetBar {
		position: sticky;
        top: 0;
        left: 0;
		margin: 0;
        background-color: rgb(207,25,25);
        width: var(--widthV);
        height: 200px;
	}

    .budgetBarYearly {
        top: 0;
        left: 0;
		margin: 0;
        background-color: rgb(207,25,25);
        width: var(--widthV);
        height: 100vh;
	}

    .vertical {
        border-left: 1px thick white;
        height: 55px;
        margin: 0;
        position:absolute;
        left: var(--widthV);
        z-index: 100;
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
        top: 0;
        z-index: 99;
        border-left: 1px thick white;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
    }

    b {
        font-weight: 600;
    }
    /* .yearLimit {
		color: #BB3327;
        position: absolute;
		top:130px;
		right:180px;
	} */

    /* .dangerZone {
        margin-left: 1200px;
    } */

    video {
        position: absolute;
        height: 100vh;
        width: 10vw;
        left: var(--widthV);
        object-fit: fill;
        /* transition: left 2s; */
    }

    .sections {
		z-index: 200;
		position: absolute;
		left: 51vw;
        top:1vh;
        bottom:1vh
	}
</style>