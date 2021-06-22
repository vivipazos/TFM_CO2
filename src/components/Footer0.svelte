<script>
    import { Container, Row, Col, MaterialApp } from 'svelte-materialify';
    
</script>
<div class='fs footer'>
    
   
        <h4>The project</h4>
        <p><slot name='about'></slot></p>
        <h4>The team</h4>
        <p><slot name='team'></slot></p>
        <h4>The data</h4>
        <p><slot name='data'></slot></p>
        <h4>Disclaimer</h4>
        <p><slot name='disclaimer'></slot></p>         
        
   
    </div>

	
<style>
    .footer {
        background-color:#faf5f5;
        color:rgb(17, 17, 17);
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