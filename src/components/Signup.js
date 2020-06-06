import React, { Component } from 'react'
import '../App.css';
import {Link} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
import {connect} from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  Toast,
  Col
} from "reactstrap";
class Signup extends Component {
  state = {
    name:"",
    email:"",
    password:"",
    image_preview:"https://instmod.herokuapp.com/imageByid/5ebd8efcf334e60017967bf8",
    image_file: null,
    image_url: "https://instmod.herokuapp.com/imageByid/5ebd8efcf334e60017967bf8",
    whatsapp:""
  };

  handleImagePreview = (e) => {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];

      this.setState({
          image_preview: image_as_base64,
          image_file: image_as_files,
      })
  }


  handleSubmitFile = () => {

     toast.warning("This may take some time...fill remaining details");
      if (this.state.image_file !== null){

          let formData = new FormData();
          formData.append('customFile', this.state.image_file);
          // the image field name should be similar to your api endpoint field name
          // in my case here the field name is customFile
          for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
  }

          axios.post(
              'https://todohack.herokuapp.com/upload',
              formData,
              {
                  headers: {
                      "auth":localStorage.getItem("Token"),
                      "username":localStorage.username,
                      "Content-type": "multipart/form-data",
                  },
              }
          )
          .then(res => {
            if(res.data)
              //Toast({html: 'Success!'});
              toast.success("Image uploaded Successfuly");
            //console.log(res.data.id);
            this.setState({image_url:'https://todohack.herokuapp.com/imageByid/'+res.data.id});
            //console.log(this.state.image_url);
          })
          .catch(err => {
              console.log(err);
              toast.error("upload only jpg/png image");
          })
      }

  }


  handleChange1=event=>{
    this.setState({name:event.target.value});
  };
  handleChange2=event=>{
    this.setState({email:event.target.value});
  };
  handleChange3=event=>{
    this.setState({password:event.target.value});
  };
  handleChange4=event=>{
    this.setState({whatsapp:event.target.value});
  };
  handleSubmit=event=>{
    event.preventDefault();
    toast.warning("Checking....");
    const user={
      name:this.state.name,
      email:this.state.email,
      password:this.state.password,
      image:this.state.image_url,
      mobileNo:"whatsapp:"+this.state.whatsapp
    };

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(user.email) ) {

   axios.post('https://todohack.herokuapp.com/signup',user)
    .then(data=>{
      //console.log(data,'ithutan');
      window.location.href = "/login";
      toast.success( 'Signup Successful!');
    })
    .catch(err=>{
      if(err)
      toast.error('Fill required details!/Change emailId exists');
    });
  }
  else {
      toast.error('Enter valid emailId and make sure that u fill all required details');
  }
  };



  render(){
   return(
     <div>
       <Card className="SignupCard">
     <ModalBody>
        <Row>
         <Col>
         <div>
         <img className="modifyProfileImage" src={this.state.image_preview} alt="image preview" />
         </div>
         <div>
          <input type="file" onChange={this.handleImagePreview}/>
          <input type="submit" onClick={this.handleSubmitFile} value="Upload Image"/>
          <ToastContainer />
          </div>
           <FormGroup>
           <Label for="name"></Label>
           <Input
             type="text"
             placeholder="Name*"
             value={this.state.name}
             onChange={this.handleChange1}
           />
             <Label for="name"></Label>
             <Input
               type="text"
               placeholder="EmailId*"
               value={this.state.email}
               onChange={this.handleChange2}
             />
             <Label for="name"></Label>
             <Input
               type="password"
               placeholder="Password*"
               value={this.state.password}
               onChange={this.handleChange3}
             />
              <Label for="name"></Label>
             <Input
               type="text"
               placeholder="Mobile Number(write with country code)"
               value={this.state.whatsapp}
               onChange={this.handleChange4}
             />
           </FormGroup>
           <div>
           <Button onClick={this.handleSubmit}> Signup</Button>
           <ToastContainer />
           </div>
           <p></p>
           <p><Link to="/login">Aldready have an account?</Link></p>
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

export default connect(mapStateToProps)(Signup);
