<script>
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

</script>

<div class="action">
    <p>
        {desc}
    </p>

    <label class="switch">
        <input type="checkbox" bind:checked={active} on:change={onChange}>
        <span class="slider round"></span>
    </label>
</div>

<style>
    .action {
        padding-bottom: 2rem;
        text-align: center;
        /* margin-left: 400px;
        margin-right: 400px; */

    }
    .switch {
        position: relative;
        display: inline-block;
        /* margin-left: 400px;
        margin-right: 400px; */
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
</style>