<script>
import InlineSVG from 'svelte-inline-svg';
import { MaterialApp, Container, Row, Col, ExpansionPanel, ExpansionPanels, Icon, Button } from 'svelte-materialify';
import {
    mdiArrowDownDropCircleOutline,
    mdiArrowDownDropCircle,
    mdiMenuDown,
    mdiArrowUpDown,
    mdiRefresh
  } from '@mdi/js';

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
<Row>
    <Col cols={4} sm={0} md={3} lg={3}></Col>
    <Col cols={4} sm={12} md={6} lg={6} class="pb-1">
        <h3>{@html title}</h3>
    </Col>
    <Col cols={4} sm={0} md={3} lg={3}></Col>
</Row>
        <Row>
            <Col cols={2} sm={1} md={2} lg={2}></Col>
            <Col cols={8} sm={11} md={8} lg={8}> 
                <ExpansionPanels popout>
                    <ExpansionPanel>
                        <span slot="header">
                            <div class="toggleBoxes">
                            <div class="icon"><InlineSVG src='./images/{icon}.svg'/></div>
                            <p class="label">{label}</p> 
                            <label class="switch">
                                <input type="checkbox" bind:checked={active} on:change={onChange}>
                                <span class="slider round"></span>
                            </label>
                            </div>
                        </span>
                        <span slot="icon" let:active>
                            <Icon path={mdiArrowDownDropCircleOutline} rotate={active ? 180 : 0} />
                          </span>
                        <p> {@html desc} </p>
                    </ExpansionPanel>
                </ExpansionPanels>

            </Col>
            <Col cols={2} sm={1} md={2} lg={2}}></Col>
        </Row>
    </Container>

</MaterialApp>
<style>
    .action {
        font-family: 'Open Sans', sans-serif;
        z-index: -1;
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

    :global(.s-expansion-panels) {
        z-index: 0 !important;
    }

    p.label {
        font-weight: 600;
        font-size: 1rem;
        color: black;
    }

    :global(.s-expansion-panel) {
        box-shadow: 0;
    }

</style>