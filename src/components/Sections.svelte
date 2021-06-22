<script>
export let  data;

import ScatterCanvas from './charts/ScatterCanvas.svelte'

let scatterStep=0;
let width=500;
let height=500;


</script>
 <svelte:window bind:innerHeight={height} bind:innerWidth={width}/>

<div class="container" >

    <div >
        {#if width}
        <ScatterCanvas
            data={data}
            layout='fs'
            step={scatterStep}
            mark='square'
            {width}
            {height}
            />
            {/if}
     
        </div>

   <div class='col scrollyText'>
        <h2>946 Gt</h2> <p> of human-made <span class="carbonDi-inline"> CO&#x2082;</span> emissions accumulates between 1990-2017. <br>Choose how you want to <b>explore</b> them :</p>
       <button class="ripple" tooltip="Accumulated emissions, global"  on:click={() => scatterStep = 0}> Global</button>
       <br>
       <button class="ripple" title="Accumulated direct emissions, according to countries' domestic production" on:click={() => scatterStep = 1}> Countries by production</button>
       <br>
       <button class="ripple" title="Accumulated direct emissions, according to countries' consumption, regardless of the place of production" on:click={() => scatterStep = 2}> Countries by consumption</button>
       <br>
       <button class="ripple" title="Main activities responsible for emissions, global % "  on:click={() => scatterStep = 3}> Sectors</button>
       <br>
       <button class="ripple" title="Activities reponsible for emissions in detail, global %" on:click={() => scatterStep = 4}> Sectors in more detail </button>
   </div>


   

   
</div>

<style>
    .col {
        position:absolute;
        top: 10vh;
        margin: 0 auto;
        left: -10vw;
        width: 300px;

    }
 
    .container {
        position: sticky;
    }
    
    button {
        margin-top: 10px;
        position: relative;
        overflow: hidden;
        -webkit-transition: background 400ms;
        transition: background 400ms;
        color: black;
        background-color: #f4f4f4;
        padding: 0.25em;
        font-family: 'Open Sans', sans-serif;
        font-size: 15px;
        outline: 0;
        border: 0;
        border-radius: 0.25rem;
        cursor: pointer;
        position: center
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

hs { }
   
</style>

