<script>
export let action
export let carbon

let baseValue = 46051;
let carbonLimit = 2620000;

$:selectedAction = action.filter(d => d.active)
    .map(d => +d.amount_all)
    .reduce((a,c) => a + c, 0)

$:modifiedValue = baseValue - selectedAction

$:console.log(modifiedValue)

let lastValue = carbon[carbon.length - 1]

console.log(lastValue)

// function {
// }

</script>

 <div class="budgetBar">

 </div>



<style>
	.budgetBar {
		position: sticky;
        top: 0;
		margin: 0 auto;
        background-color: rgb(204, 0, 51);
        width: 800px;
        height: 200px;
	}

</style>