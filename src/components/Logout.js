import React, { Component } from 'react'
import axios from 'axios'
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Logout extends Component {

  handleSubmit=event=>{
    event.preventDefault();
    localStorage.clear();
      window.location.href = "/login";
  };

  render(){

   return(
     <div >
     <Card className="LoginCard">
     <div className='heading'>Confirm before you logout</div>
     <p></p>
     <form onSubmit={this.handleSubmit}>
     <Button className="btn add black" type='submit'>logout</Button>
     </form>
     </Card>
     </div>
   );
       }
     }

export default Logout
