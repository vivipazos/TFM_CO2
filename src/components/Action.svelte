<script>
import InlineSVG from 'svelte-inline-svg';
import { MaterialApp } from 'svelte-materialify';


export let desc;
export let category;
export let label;
export let amount_all;
export let amount_some;
export let amount_some_desc;
export let source;
export let icon;
// export let action;
export let active;
export let onChange;

</script>

<MaterialApp>

<p>Individual title</p>
{#if category === "Individual"}
<div class="action">
    <p>Individual title</p>
    <div class="action-block">
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                <div class="icon">
                    <InlineSVG src='./images/{icon}.svg'/>
                </div>
            <label class="switch">
                <input type="checkbox" bind:checked={active} on:change={onChange}>
                <span class="slider round"></span>
            </label>
            </div>
            <div class="d-flex flex-column">
                <h4>{label}</h4>
                <p> {desc} </p>
            </div>
        </div>       
    </div>
</div>

{:else if category === "Governments"}
<div class="action">
    <p>Goverment title</p>
    <div class="action-block">
        <div class="d-flex flex-row">
            <div class="d-flex flex-column">
                <div class="icon">
                    <InlineSVG src='./images/{icon}.svg'/>
                </div>
            <label class="switch">
                <input type="checkbox" bind:checked={active} on:change={onChange}>
                <span class="slider round"></span>
            </label>
            </div>
            <div class="d-flex flex-column">
                <h4>{label}</h4>
                <p> {desc} </p>
            </div>
        </div>       
    </div>
</div>
{/if}


</MaterialApp>
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