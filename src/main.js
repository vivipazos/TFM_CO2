import App from './App.svelte';
import story from './data/story.json'
import actions from './data/actions.json'
import carbon from './data/carbon.json'

const app = new App({
    target: document.body,
    props:{
        content:story.article,
        actions:actions,
        carbon:carbon
    } 
})

export default app;


