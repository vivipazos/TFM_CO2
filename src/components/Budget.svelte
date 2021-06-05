<script>

function toggle () {
     data_modified.map(d => {
        d.active = d.active ? false : true;
        return d;
        })
    }
</script>

<main>
 <div class="budgetBar">
  
 </div>

<div>
    {#each data_modified as data}
        <p>
            {d.description}
        </p>

        <div>
            <button on:click={toggle}
            >{d.action}
          </button>
        </div>
    {/each}
</div>

</main>

<style>
	.budgetBar {
		position: sticky;
		margin: 0 auto;
	}
</style>