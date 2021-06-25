<script>
    import {Footer, Container, Icon, Button, Row, Col, MaterialApp } from 'svelte-materialify';
    import ViT from './img/ViT.svelte'
    import UdG from './img/UdG.svelte'
    import Tweet from './img/Tweet.svelte'
    import { mdiGithub,  mdiEmailOutline, mdiMessage  } from '@mdi/js'; 
    import InlineSVG from 'svelte-inline-svg';
    
   
   
</script>

<hr>
 <MaterialApp>
     
 <div class='fs footer'>   
    <div class='col'>
    <Container>
        <h4>Data sources</h4>
        <p><slot name='data'></slot></p>
        <h4>Disclaimer</h4>
        <p><slot name='disclaimer'></slot></p>        
         <Row>
            <Col cols={12} sm={12} md={8}>
                <h4>The project </h4>
                <p><slot name='about'></slot></p>
                <h4>The team</h4>
                <p><slot name='team'></slot></p> 
            </Col>
            <Col cols={12} sm={12} md={4}>
                 <span > <InlineSVG src='./images/favicon_co2.svg'/></span>
                 <UdG /> <ViT />          
            </Col>    
        </Row>
    </Container>
    </div>

</div>
</MaterialApp>

<MaterialApp>
    <Footer padless class="red darken-4 justify-center flex-column">
      <div >
         <h4>  <b>Share it</b> <Tweet tweet='' url='' />   
               <b>Connect</b>
                    <Button icon class="white-text"  on:click={()=> window.open ("https://github.com/victorgd97/TFM_CO2")}>
                        <Icon path={mdiGithub} />
                    </Button> 
               <b> Feedback?</b>
                     <Button icon class="white-text" on:click={()=> window.open ( "https://docs.google.com/forms/d/e/1FAIpQLSeUZXa3_iFA5ib_CU8G2vobkAWqqHeJW3WRoAFrvU63hMLs5w/viewform")} >
                         <Icon path={mdiMessage} />
                     </Button>
          </h4>      
      </div>
      <div class="red darken-1 pa-2 text-center" style="width:100%">
          Published 26 June 2021
      </div>
    </Footer>
    </MaterialApp>



<style>
    .footer {
        background-color:#faeded;
        color:rgb(19, 19, 19);
        padding-top:1rem;
        padding-left:0rem;
        padding-right:0rem;
        
    }
    .footer p {       font-size: 0.8rem;   }
            b {        font-weight: 700;    }
            h4 {        font-size:1rem;    }
           
    @media screen and (min-width: 42rem) {
        .footer {
            padding-left: 0;
            padding-right: 0;
        }
    }
    
    
  


    
</style> 
 