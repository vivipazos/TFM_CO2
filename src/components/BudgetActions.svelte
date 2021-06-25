<script>
import {scaleLinear} from 'd3-scale'
import InlineSVG from 'svelte-inline-svg';
import IntersectionObserver from "svelte-intersection-observer";

export let action;
export let carbon;

export function reset() {
    growth = +carbonStart;
}

const arrow = './images/arrow.svg';

let element;
let intersecting;

let baseValue = 17000; //Mt CO2, constant yearly increase if nothing done
let carbonEnd  = 2721042; //Mt CO2, the amount at the edge of the allowed budget before reaching 1.5 degrees
let carbonStart = +carbon[carbon.length - 1].carbonDioxide;
let selectedActions = action;
let actives_sum = 0;
let growth = +carbonStart;

let interval = 1000; /* In milliseconds */
let yearlyTime = 1000; /* In milliseconds */

let scale = scaleLinear()
    .domain([carbonStart, carbonEnd])
    .range([0,60])

$: if (action) {
    selectedActions = action.filter(d => d.active === true);
    actives_sum = selectedActions.reduce((accum, d) => accum + d.amount, 0);
}

$:modifiedValue = baseValue - actives_sum;

$:console.log(intersecting)

const grow = () => {
    let pace = modifiedValue / (yearlyTime / interval);
    growth += pace;
}

let idVar
$:if (intersecting) { idVar = setInterval(grow, interval); }

$:if (growth > carbonEnd || modifiedValue < 1) { clearInterval(idVar) } // Stops growth when annual emissions are below 0

$:yearEnd = 2020 + Math.floor((carbonEnd - carbonStart) / modifiedValue);

$:if (modifiedValue < 1) {
    modifiedValue = 0;
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// $:console.log(growth)

</script>
<IntersectionObserver once {element} bind:intersecting={intersecting} threshold=1>
<hr>
<div bind:this={element} class="action-bar-wrapper">
    <div class="budgetBar" style="width:{scale(growth)}vw">
        <video  autoplay muted loop>
            <source src="./smokeWide3.mp4" type="video/mp4">
            </video>
    </div>
    <div class="annotation-layer">
        {#if modifiedValue > 1}
        <p class="bolder">Based on your choices, annual emissions are now at: <b>{numberWithSpaces(modifiedValue)}</b> Mt CO&#x2082;.</p>
        {:else}
        <p>Great! Annual emissions are now at zero! But it's unlikely all the choices you selected will happen - read below to find out more.</p>
        {/if}
    </div>
    <div class="carbon-limit">
        {#if modifiedValue > 1}
        <p>We may reach the carbon limit in </p>
        <span class="yearEnd">{yearEnd}</span>
        <div class="arrow2">
            <InlineSVG src={arrow}/>
        </div>
        {:else}
        <div class="congrats-box">
        <p><b>Congrats!</b> Your choices gave us more time.</p>
        </div>
        {/if}
    </div>
</div>

</IntersectionObserver>   
<style>
    .action-bar-wrapper {
        box-shadow: 0 1rem 1rem -1rem #00000033;
        background-color: white;
        position: sticky;
        top: 0;
        left: 0;
        margin: 0;
        z-index: 1;
    }

    .budgetBar {
        position: sticky;
        top: 0;
        left: 0;
        margin: 0;
        background-color: rgb(225,29,41);
        height: 200px;
        z-index: 100;
        transition: width 2s linear;
        
    }

    @keyframes grow {
        from {
            width:0vw;
        }
        to {
           width:100vw;
        }
    }

    @keyframes fadeIn {
    99% {
        visibility: hidden;
    }
    100% {
        visibility: visible;
        }
    }

video {
    position: absolute;
    height: 200px;
    width: 40vw;
    object-fit: fill;
    pointer-events: all;
    right: -40vw;
    top:0;
    margin:0;
    padding: 0;
}

.carbon-limit {
    top: 10px;
    right: 10px;
    width: 140px;
    position: absolute;
    font-size: 14px;
    z-index: 300;
    text-align: right;
    margin: 0;
    padding: 0;
    opacity: 0.7;
}

.annotation-layer {
    top: 10px;
    left: 20px;
    width: 300px;
    position: absolute;
    font-size: 14px;
    z-index: 300;
    text-align: left;
    margin: 0 auto;
    padding: 0;
    opacity: 0.7;
}

.carbon-limit p {
    margin: 0;
}

.yearEnd {
    font-weight: 700;
    font-size: 20px;
    text-align: right;
}

/* Arrow */
.arrow2 {
        width:30px;
        transform: rotate(180deg);
        position: relative;
        margin-left: 80%;
    }

.congrats-box {
    text-align: left;

}

p.bolder {
    font-weight: 600;
}

hr {
    border-top: 2px solid black;
    position: relative;
}
</style>