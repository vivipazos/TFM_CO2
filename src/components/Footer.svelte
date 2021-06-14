<script>
    import { Container, Row, Col, MaterialApp } from 'svelte-materialify';
    
</script>
<div class='fs footer'>
    
   
        <h4>The project</h4>
        <p><slot name='about'></slot></p>
        <h4>About the data</h4>
        <p><slot name='data'></slot></p>
        <h4>Disclaimer</h4>
        <p><slot name='disclaimer'></slot></p>         
        <p>This project was designed and developed in the <a href='http://www.mastervisualtoolsudg.com/'>Master’s program in Visual Tools to Empower Citizens (MVTEC)</a> organized by <a href='https://www.fundacioudg.org/'>Fundació UdG</a> and the <a href='https://www.fundaciovit.org/'>ViT Foundation</a></p>
        
   
    </div>

	
<style>
    .footer {
        background-color:#181616;
        color:rgb(247, 238, 238);
        padding-top:1rem;
        padding-left:10rem;
        padding-right:10rem;
    }
    .footer p {        font-size: 1rem;    }

    b {        font-weight: 800;    }

    @media screen and (min-width: 42rem) {
        .footer {
            padding-left: 5;
            padding-right: 5;
        }
    }

</style>