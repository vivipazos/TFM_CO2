<script>
export let  data;

import ScatterCanvas from './charts/ScatterCanvas.svelte'

let scatterStep=0;
let width=1000;
let height=900;

// let innerHeight;
// let innerWidth;


</script>

<!-- <svelte:window bind:innerHeight={innerHeight} bind:innerWidth={innerWidth}/> -->

<div class="container">

   <div class='col'>
       <button title="0" on:click={() => scatterStep = 0}> World</button>
       <button title="1" on:click={() => scatterStep = 1}> Production</button>
       <button title="2" on:click={() => scatterStep = 2}> Consumption</button>
       <button title="3" on:click={() => scatterStep = 3}> Sectors</button>
       <button title="4" on:click={() => scatterStep = 4}> Sectors,detail</button>
   </div>




   <div >
   {#if width}
   <ScatterCanvas
       data={data}
       layout='wide'
       step={scatterStep}
       mark='square'
       {width}
       {height}
       />
       {/if}

   </div>

   <div class="yearspan">
    <hr class="horizontal" />
   </div>
</div>

<style>
    .col {
        position:absolute;
        right: 50vw ;
        top: 25vh;
        width:100px;

    }
    .horizontal {
        border-left: 100px thick white;
        left: 55px;
        margin: 0;
        position:absolute;
         z-index: 100;
    }
    .container {
        position: relative !default;
    }
</style>

