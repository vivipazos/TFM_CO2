<script>
import InlineSVG from 'svelte-inline-svg';
import { MaterialApp, Container, Row, Col } from 'svelte-materialify';


export let desc;
export let category;
export let label;
export let amount_all;
export let amount_some;
export let amount_some_desc;
export let source;
export let icon;
export let title;
// export let action;
export let active;
export let onChange;

</script>

<MaterialApp>

<Container>
<div class="action">
    <Row class="p-1">
    <Col cols={2} sm={0} md={2} lg={2}></Col>
    <Col cols={8} sm={0} md={7} lg={7} class="pb-9">
    <h4>{@html title}</h4>
    </Col>
    <Col cols={2} sm={0} md={2} lg={2}></Col>
    </Row>
        <Row class="p-1">
            <Col cols={2} sm={0} md={2} lg={2}></Col>
            <Col cols={5} sm={0} md={5} lg={5} class="p-2">
            <div>
            <div class="icon"><InlineSVG src='./images/{icon}.svg'/></div>
            <p><b>{label}</b></p>
            </div>
            </Col>
            <Col cols={2} sm={0} md={2} lg={2}>
            <label class="switch">
                <input type="checkbox" bind:checked={active} on:change={onChange}>
                <span class="slider round"></span>
            </label>
            </Col>
            <Col cols={2} sm={0} md={2} lg={2}></Col>
        </Row>
        <Row class="p-1">
            <Col cols={2} sm={0} md={2} lg={2}></Col>
            <Col cols={5} sm={0} md={5} lg={5}>
            <p> {desc} </p>
            </Col>
            <Col cols={5} sm={0} md={2} lg={5}}></Col>
        </Row>
    </Container>

</MaterialApp>
<style>

    .h4 {
        font-family: "Open Sans", sans-serif !important;
        font-size: 30px;
    }

    .action {
        font-family: 'Open Sans', sans-serif;
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
        max-width: 40px; 
    }

    :global(.s-col){
        padding:0;
    }

</style>