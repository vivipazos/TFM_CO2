<script>
export let  data;

import ScatterCanvas from './charts/ScatterCanvas.svelte'
   
let scatterStep=0;
let width=1000;
let height=800;

   
</script>

   
   <div class='col'>
       <button title="0" on:click={() => scatterStep = 0}> World</button>
       <button title="1" on:click={() => scatterStep = 1}> Production</button>
       <button title="2" on:click={() => scatterStep = 2}> Consumption</button>
       <button title="3" on:click={() => scatterStep = 3}> Sectors</button>
       <button title="4" on:click={() => scatterStep = 4}> Sectors,detail</button>
   </div>	
   
   
   <div class="container">
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
   
<style>
    .col {
        position:absolute;
        right: 50vw ;
        top: 25vh;
        width:100px;
        
    }
</style>

