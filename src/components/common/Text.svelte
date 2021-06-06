<script>
    export let text;
</script>

<section class='col-text text'>
  {#each text as p}
      <p>{@html p.p}</p>
  {/each}
</section>