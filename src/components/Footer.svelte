<script>
    import { Container, Row, Col, MaterialApp } from 'svelte-materialify';
    import ViT from './img/ViT.svelte'
    import UdG from './img/UdG.svelte'
    import Tweet from './img/Tweet.svelte'
   
</script>
<div class='fs footer'>
    <div class='col'>
    <Container>
        <p>Published 26 June 2021</p>
        <h4>Data sources</h4>
        <p><slot name='data'></slot></p>
        <h4>Disclaimer</h4>
        <p><slot name='disclaimer'></slot></p>
        
         <Row>
            <Col cols={12} sm={12} md={8}>
                <h4>The project </h4>
                <pp><slot name='about'></slot></pp>
                <br>
                <UdG /> <ViT />
                
            </Col>
            <Col cols={12} sm={12} md={4}>
                <h4>The team</h4>
                <pp><slot name='team'></slot></pp>
                
                <h4><b>Share it!</b> <Tweet tweet='' url='' />  </h4>
                <h4><b>Tag it! #NAME</b>
                <h4><b>Connect! (+git)</b>        
                <h4><b>Feedback? (@)</b> 
                                    </Col>
        
           
        </Row>
        
        
    </Container>
    </div>
</div>

<style>
    .footer {
        background-color:#e0d1d1;
        color:rgb(19, 19, 19);
        padding-top:1rem;
        padding-left:1rem;
        padding-right:1rem;
    }
    .footer p {        font-size: 0.6rem;    }
            b {        font-weight: 700;    }
            h4 {        font-size:1rem;    }
            pp {        font-size: 0.8rem;    }

    @media screen and (min-width: 42rem) {
        .footer {
            padding-left: 0;
            padding-right: 0;
        }
    }
</style> 
 