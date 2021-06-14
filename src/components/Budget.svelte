<script>
export let action
export let carbon

export let year
export let percentage
export let widthV

let baseValue = 17000; //Mt CO2, constant yearly increase if nothing done
let carbonLimit  = 2721042; //Mt CO2, the amount at the edge of the allowed budget before reaching 1.5 degrees
/* let circles = new Array(40).fill()
	.map(a => ({
		x: Math.random(),
		y: Math.random(),
        r: 8
	})); /*

//$: if(percentage)
//{widthV = percentage.toFixed(2).toString() + "%"}
/* 
$:selectedAction = action.filter(d => d.active)
    .map(d => +d.amount_all)
    .reduce((a,c) => a + c, 0) 

$:modifiedValue = baseValue - selectedAction

$:console.log(modifiedValue)

let lastValue = carbon[carbon.length - 1]

console.log(lastValue)
*/
// function {
// }

</script>
{#if year}
<div style="--widthV: {widthV}" class="budgetBarYearly">
    <hr class="vertical" />
    <p class="year">{year} <br>{carbon} Gt CO&#xb2</p>
     <p class="yearLimit">2040</p>
    <video autoplay muted loop>
        <source src="./smoke_edge3.mp4" type="video/mp4">
    </video>
<!--     <svg class="dangerZone" viewBox="0 0 {width} {height}">
            <g>
                {#each circles as d}
                <circle cx={d.x} cy={d.y} r={d.r} fill={d.color}/>
                {/each}
            </g>
    </svg> -->
</div>
{/if}

 <div class="budgetBar">

 </div>


<style>
	.budgetBar {
		position: sticky;
        top: 0;
        left: 0;
		margin: 0;
        background-color: rgb(204, 0, 51);
        width: 800px;
        height: 200px;
	}

    .budgetBarYearly {
        top: 0;
        left: 0;
		margin: 0;
        background-color: rgb(207,25,25);
        background-image: linear-gradient(rgb(207,25,25) #CC3333);
        /* transition: width 2s linear; */
        width: var(--widthV);
        height: 100vh;
	}

    .vertical {
        border-left: 3px dotted black;
        height: 130px;
        margin: 0;
        position:absolute;
        left: var(--widthV);
        z-index: 100;
    }
    .year {
        height: 150px;
        margin: 0;
        position:absolute;
        top:130px;
        left: var(--widthV);
        z-index: 100;
    }
    .yearLimit {
		color: #BB3327;
        position: absolute;
		top:130px;
		right:180px;
	}
    .dot {
        height: 12px;
        width: 12px;
        background-color: #BB3327;
        border-radius: 50%;
        display: inline-block;
    }
    .dangerZone {
        margin-left: 1200px;
    }
    video {
        position: absolute;
        height: 100vh;
        width: auto;
        left: var(--widthV);
        /* transition: left 2s linear; */
    }
</style>