<script>
import {scaleLinear} from 'd3-scale'
export let action;
export let carbon;

console.log(carbon)

let baseValue = 17000; //Mt CO2, constant yearly increase if nothing done
let carbonEnd  = 2721042; //Mt CO2, the amount at the edge of the allowed budget before reaching 1.5 degrees
let carbonStart = carbon[carbon.length - 1].carbonDioxide;
let selectedActions = action;
let actives_sum = 0;
let growth = +carbonStart;

let interval = 2000; /* In milliseconds */
let yearlyTime = 5000; /* In milliseconds */

let scale = scaleLinear()
    .domain([carbonStart, carbonEnd])
    .range([0,100])

$: if (action) {
    selectedActions = action.filter(d => d.active === true);
    actives_sum = selectedActions.reduce((accum, d) => accum + d.amount, 0);
}

$:modifiedValue = baseValue - actives_sum;

const grow = () => {
    let pace = modifiedValue / (yearlyTime / interval);
    growth += pace;
    console.log('Growth: ' + growth, 'Pace: ' + pace, 'ModifiedValue' + modifiedValue);
}

setInterval(grow, interval);

</script>
    
<div class="budgetBar" style="width:{scale(growth)}vw"></div> 
    
<style>
    .budgetBar {
        position: sticky;
        top: 0;
        left: 0;
        margin: 0;
        background-color: rgb(255,1,0);
        width: 0vw;
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

    .budgetBarYearly {
        top: 0;
        left: 0;
        margin: 0;
        background-color: rgb(255,1,0);
        width: var(--widthV);
        height: 100vh;
    }

    .vertical {
        border-left: 1px thick white;
        height: 55px;
        margin: 0;
        position:absolute;
        left: var(--widthV);
        z-index: 100;
    }
    .year {
        height: 60px;
        margin: 10px;
        position:absolute;
        top: 0;
        left: var(--widthV);
        z-index: 100;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
    }
    .mark {
        height: 60px;
        margin: 10px;
        position:absolute;
        top: 0;
        z-index: 99;
        border-left: 1px thick white;
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        color: black;
        pointer-events: all;
        animation: 3s fadeIn;
        animation-fill-mode: forwards;
       
    }
    @keyframes fadeIn {
    99% {
        visibility: hidden;
    }
    100% {
        visibility: visible;
        }
    }

    b {
        font-weight: 600;
    }
    /* .yearLimit {
        color: #BB3327;
        position: absolute;
        top:130px;
        right:180px;
    } */

    /* .dangerZone {
        margin-left: 1200px;
    } */

    video {
        position: absolute;
        height: 100vh;
        width: 30vw;
        left: calc(var(--widthV) - 15vw);
        object-fit: fill;
        offset: 0 0 0 3em;
        pointer-events: all;
    }
</style>