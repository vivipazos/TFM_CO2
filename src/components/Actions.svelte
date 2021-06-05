<script>
export let data

function toggle () {
     data.map(d => {
        d.active = d.active ? false : true;
        return d;
        })
    }
</script>

{#each data as object}
    <div class="action">
        <p>
            {object.description}
        </p>

        <button class="action__button" on:click={toggle}>
            {object.action}
        </button>
    
    </div>
{/each}

<style>
    .action {
        padding-bottom: 2rem;
    }
</style>