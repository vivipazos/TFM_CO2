<script>
import {scaleLinear} from 'd3-scale'
import InlineSVG from 'svelte-inline-svg';

export let action;
export let carbon;

const arrow = './images/arrow.svg';

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
$:console.log(modifiedValue)

const grow = () => {
    let pace = modifiedValue / (yearlyTime / interval);
    growth += pace;
}

let idVar = setInterval(grow, interval);

$:if (growth > carbonEnd) { clearInterval(idVar) }

$:yearEnd = 2020 + Math.floor((carbonEnd - carbonStart) / modifiedValue);



</script>
<div class="action-bar-wrapper">
    <div class="budgetBar" style="width:{scale(growth)}vw">
        <video title= "The width of the red is the accumulated emissions. There is some uncertainty in the numbers, that is why the edge is not precisely defined" autoplay muted loop>
            <source src="./smokeSquare2.mp4" type="video/mp4">
            </video>
    </div>
    <div class="carbon-limit">
        <p>We will reach the carbon limit in </p>
        <span class="yearEnd">{yearEnd}</span>
        <div class="arrow">
            <InlineSVG src={arrow}/>
        </div>
    </div>
</div>

    
<style>
    .action-bar-wrapper {
        box-shadow: 0 4px 2px -2px gray;
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

.carbon-limit p {
    margin: 0;
}

.yearEnd {
    font-weight: 700;
    font-size: 20px;
    text-align: right;
}

/* Arrow */
.arrow {
        width:40px;
        transform: rotate(180deg);
        margin-left: 10vw;

    }
</style>