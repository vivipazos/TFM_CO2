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

   <div class='col scrollyText'>
       <p>See emissions broken down by:</p>
       <button class="ripple" title="0" on:click={() => scatterStep = 0}> Global emissions versus land use</button>
       <button class="ripple" title="1" on:click={() => scatterStep = 1}> Countries by production</button>
       <button class="ripple" title="2" on:click={() => scatterStep = 2}> Countries by consumption</button>
       <button class="ripple" title="3" on:click={() => scatterStep = 3}> Sectors</button>
       <button class="ripple" title="4" on:click={() => scatterStep = 4}> Sectors in more detail </button>
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
        top: 25vh;
        margin: 0 auto;
        left: -20vw;
        width: 300px;

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

    button {
        margin-top: 10px;
        position: relative;
        overflow: hidden;
        -webkit-transition: background 400ms;
        transition: background 400ms;
        color: black;
        background-color: #f4f4f4;
        padding: 0.5em;
        font-family: 'Open Sans', sans-serif;
        font-size: 15px;
        outline: 0;
        border: 0;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .ripple {
        background-position: center;
        -webkit-transition: background 0.8s;
        transition: background 0.8s;
    }

    .ripple:hover {
        background: #595959 radial-gradient(circle, transparent 1%, #595959 1%) center/15000%;
    }

    .ripple:active {
        background-color: #e1e0e3;
        background-size: 100%;
        -webkit-transition: background 0s;
        transition: background 0s;
    }

    .button:focus{
        background-color:#595959 ;
    }
</style>

