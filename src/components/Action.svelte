<script>
import InlineSVG from 'svelte-inline-svg';

export let desc;
export let category;
export let label;
export let amount_all;
export let amount_some;
export let amount_some_desc;
export let source;
// export let action;
export let active;
export let onChange;

const cities = './images/cities.svg';
const coal = './images/coal.svg';
const energy = './images/energy.svg';
const fashion = './images/fashion.svg';
const recycle = './images/recycle.svg';
const transport = './images/transport.svg';
const vegetarian = './images/vegetarian.svg';
const wetland = './images/wetland.svg';


</script>
<div class="action">

    {#if label === 'Recycling'}
    <div class="action-block">
        <div id="left-col">
            <div class="icon">
                <InlineSVG src={recycle}/>
            </div>
        <label class="switch">
            <input type="checkbox" bind:checked={active} on:change={onChange}>
            <span class="slider round"></span>
        </label>
        </div>
        <div id="right-col">
            <h4>{label}</h4>
            <p> {desc} </p>
        </div>
    </div>
    {:else if label === 'Eat less meat'}
    <div class="action-block">
        <div id="left-col">
            <div class="icon">
                <InlineSVG src={vegetarian}/>
            </div>
        <label class="switch">
            <input type="checkbox" bind:checked={active} on:change={onChange}>
            <span class="slider round"></span>
        </label>
        </div>
        <div id="right-col">
            <h4>{label}</h4>
            <p> {desc} </p>
        </div>
    </div>

    {/if}
</div>

<style>
    .action {
        padding-bottom: 2rem;
        margin-top: 50vh;
        text-align: left;
        margin: 0 auto;
        width: 450px;
        font-family: 'Open Sans', sans-serif;
        font-size: 22px;
        line-height: 26px;
        padding-top: 10vh;
    }

    #left-col {
    }

    #right-col {
        right: 0;
        position: absolute;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .switch input { 
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f2f2f2;
        -webkit-transition: .3s;
        transition: .3s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        box-shadow: 0 0 6px #00000033;
        -webkit-transition: .3s;
        transition: .3s;
    }

    input:checked + .slider {
        background-color: rgb(204, 0, 51);
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .icon {
        width: 20px;
    }

</style>