<script>
export let action
export let carbon

export let year
export let percentage
export let widthV

$: console.log(widthV)
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
</div>
{/if}

 <div class="budgetBar">

 </div>


<style>
	.budgetBar {
		position: sticky;
        top: 0;
        left: 0;
		margin: 0 auto;
        background-color: rgb(204, 0, 51);
        width: 800px;
        height: 200px;
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
            margin: 0;
            height: 150px;
            position:absolute;
            left: var(--widthV);
            z-index: 100;
        }
</style>