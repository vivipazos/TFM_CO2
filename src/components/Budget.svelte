<script>
export let action
export let carbon

export let year
export let percentage
export let widthV

let baseValue = 17000; //Mt CO2, constant yearly increase if nothing done
let carbonLimit  = 2721042; //Mt CO2, the amount at the edge of the allowed budget before reaching 1.5 degrees

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
    <p class="year">{year} <br>{carbon/1000} Gt CO&#xb2</p>
    <p class="yearLimit">2040</p>
    <span class="dot"></span>
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
        height: 100vh;
	}

    .budgetBarYearly {
        top: 0;
        left: 0;
		margin: 0;
        background-color: rgb(204, 0, 51);
        transition: width 2s;
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
		color: rgb(204, 0, 51);
        position: absolute;
		top:130px;
		right:180px;
	}
    .dot {
        height: 25px;
        width: 25px;
        background-color: rgb(204, 0, 51);
        border-radius: 50%;
        display: inline-block;
    }
</style>