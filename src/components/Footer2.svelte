<script>
    import { Container, Row, Col, MaterialApp } from 'svelte-materialify';
    import ViT from './img/ViT.svelte'
    import UdG from './img/UdG.svelte'
    import Tweet from './img/Tweet.svelte'

</script>
<div class='fs footer'>
    <div class='col'>
    <Container>
        <h4>Data sources</h4>
        <p><slot name='data'></slot></p>

         <Row>
            <Col cols={12} sm={12} md={8}>
                <h4>The project</h4>
                <p><slot name='about'></slot></p>
                <h4>The team</h4>
                <p><slot name='about'></slot></p>
            </Col>
            <Col cols={12} sm={12} md={4}>
                <h4>Made by</h4>
                <p><slot name='team'></slot></p>
                <p><b>MVTEC mentors: </b> Xaquin G.V &  Matt Osborn</p>
                
            </Col>
        </Row>
        <p>Developed in the <a href='http://www.mastervisualtoolsudg.com/'>Master’s program in Visual Tools to Empower Citizens (MVTEC)</a> organized by <a href='https://www.fundacioudg.org/'>Fundació UdG</a> and the <a href='https://www.fundaciovit.org/'>ViT Foundation</a></p>
        <Row>
           <UdG /> <ViT /> <h4><b>Share it!</b>  <Tweet  tweet=''  url=''  />  </h4>
        </Row>
        <Row>
            <h4>Share it!  <Tweet  tweet=''  url=''  />  </h4>
         </Row>
    </Container>
    </div>
</div>
	
<style>
    .footer {
        background-color:#f5d6d6;
        color:rgb(49, 49, 49);
        padding-top:5rem;
        padding-left:1rem;
        padding-right:1rem;
    }
    .footer p {        font-size: 0.8rem;    }
            b {        font-weight: 700;    }
            h4 {        font-size:1rem;    }

    @media screen and (min-width: 42rem) {
        .footer {
            padding-left: 0;
            padding-right: 0;
        }
    }
</style>