import React, { Component } from 'react'
import '../App.css';
import {Link} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
import {connect} from 'react-redux'
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
class Login extends Component {
  state = {
    email:"",
    password:""
  };

  handleChange1=event=>{
    this.setState({email:event.target.value});
  };
  handleChange2=event=>{
    this.setState({password:event.target.value});
  };
  handleSubmit=event=>{
    event.preventDefault();
    const user={
      email:this.state.email,
      password:this.state.password
    };
    console.log(user);
   axios.post('https://todohack.herokuapp.com/signin',user)
    .then(data=>{
      //console.log(data);
      localStorage.setItem("Token",data.data.token);
      localStorage.setItem("image",data.data.Image);
      console.log(localStorage.getItem("Token"));
      if(data.data=='Wrong password')
        {toast.error('Wrong password!!!');return;}
      if(data.data=='No registered emailId found')
        {toast.error('No registered emailId found!!!');return;}
      toast.success('Login Successful');
      window.location.href = "/todo";
    })
    .catch(err=>{
      console.log(err);
      if(err)
      window.location.href = "/signup"
    });
  };

  render(){
   return(

     <div>
      <Card className="LoginCard">
         <div className='heading'>Todo App</div>
           <ModalBody>
              <Row>
               <Col >
                 <FormGroup>
                   <Input
                     type="text"
                     placeholder="EmailId*"
                     value={this.state.email}
                     onChange={this.handleChange1}
                   />
                   <Label className="left"></Label>
                   <Input
                      type="password"
                     placeholder="Password*"
                     value={this.state.password}
                     onChange={this.handleChange2}
                   />

                 </FormGroup>
                 <div>
                 <Button className="center" onClick={this.handleSubmit}> Submit</Button>
                  <ToastContainer/>
                   </div>
                  <p></p><p><Link to="/signup">Don't have an account?</Link></p>
                 </Col>
             </Row>
           </ModalBody>
          </Card>
     </div>
   );
       }
     }

     const mapStateToProps=(state)=>{
       return {token:state.token}
     }


export default connect(mapStateToProps)(Login);
