<script>
export let description
export let action
export let active
export let toggle
</script>

<div class="action">
    <p>
        {description}
    </p>

    <button class="action__button" on:click={toggle}>
        {action}
    </button>

</div>

<style>
    .action {
        padding-bottom: 2rem;
    }
</style>