import React,{Component} from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Row,
  Card,
  Col
} from "reactstrap";

class Home extends Component {


  render(){
   return(

     <div>
      <h2 className='text-center'>GET STARTED</h2>
      <Card className='HomePage'>
       <p> Step 1: Signup for free</p>
        <img src="https://instmod.herokuapp.com/imageByid/5eda1cfc2093670017334aa2"/>
          </Card>
      <Card className='HomePage'>
           <p> Step 2: Login</p>
            <img src="https://instmod.herokuapp.com/imageByid/5eda1c842093670017334a9f"/>
              </Card>
      <Card className='HomePage'>
               <p> Step 3: Add Categories and Tags</p>
                <img src="http://g.recordit.co/oThO1yMdqv.gif"/>
                  </Card>
      <Card className='HomePage'>
         <p> Step 4: Add and update Tasks</p>
         <img src="http://g.recordit.co/TICTprdBkV.gif"/>
          </Card>
      <Card className='HomePage'>
             <p> Step 5: Use Speech Recogniser for Input fields(Note:Disable the mic after using)</p>
             <img src="http://g.recordit.co/P1pmHypD1R.gif"/>
        </Card>
      <Card className='HomePage'>
               <p> Step 6: Quick Access through WhatsApp</p>
               <img src="http://g.recordit.co/9tdBQf0RaD.gif"/>
          </Card>
    

     </div>



  )

  }
}
export default Home;
