import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import uuid from "uuid";
import {
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
  ListGroup,
  ListGroupItem,
  InputGroup,
  Collapse
} from "reactstrap";
import {MdDelete} from "react-icons/md";
import { addCategory, deleteCategory } from "../actions/categoriesActions";

import {BsFillMicFill,BsFillMicMuteFill} from "react-icons/bs";
import {FaLayerGroup,FaTags,FaRobot} from "react-icons/fa";
import {GrAddCircle} from "react-icons/gr";
import {AiFillRobot} from "react-icons/ai";

const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'


class CategoryModal extends Component {

  constructor() {
    super();
    this.state = {
      catCollapse: false,
      nameInvalid: false,
      name: "",
      description: "",
      listening: false,
      Input_id:"Categoryname",
      Bot_Status:"Not Listening"
    };
  }


  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen() {
    const Input_id_value=this.state.Input_id;
    console.log(Input_id_value);
    //console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
          this.setState({Bot_Status:"...continue listening..."})
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
        this.setState({Bot_Status:"Not listening"})
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
      this.setState({Bot_Status:"Listening!"})
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('Categorycheck').innerHTML = interimTranscript
      document.getElementById(Input_id_value).value = finalTranscript
      if(Input_id_value==="Categoryname")
      this.setState({ name:finalTranscript});
      if(Input_id_value==="Categorydescription")
      this.setState({ description:finalTranscript});

    //-------------------------COMMANDS------------------------------------

      /*const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)
      console.log('stopCmd', stopCmd)

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        this.setState({
          listening: !this.state.listening
        });
        recognition.stop()
        recognition.onend = () => {
          console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          document.getElementById(Input_id_value).value = finalText
        }
      }*/
    }

  //-----------------------------------------------------------------------

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }

  }

  CallforName=e=>{
    e.preventDefault();
    this.setState({
      Input_id: "Categoryname"
    }, this.toggleListen)
  }
   CallforDescription=e=>{
     e.preventDefault();
     this.setState({
       Input_id: "Categorydescription"
     }, this.toggleListen)
   }


  toggleCategoryCollapse = () => {
    this.setState({
      catCollapse: !this.state.catCollapse
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  onCategorySubmited = e => {
    e.preventDefault();
    if(this.state.name === "") {
      this.setState({
        nameInvalid: true
      })
    } else {
      this.setState({
        nameInvalid: false
      }, () => {
        const category = {
          _id: uuid(),
          name: this.state.name,
          description: this.state.description
        };
        // Add todo via newCategory action
        this.props.addCategory(category);

        /* Close category modal */
        this.props.toggleCategoryModal();
      })
    }
  };

  onDeleteCategory = id => {
    this.props.deleteCategory(id);
  };

  render() {
    const { categories } = this.props.category;
    //console.log(this.state.nameInvalid,'category');
    return (
      <Modal isOpen={this.props.categoryModal} toggle={this.props.toggleCategoryModal}>
        <Form onSubmit={this.onCategorySubmited}>
          <ModalHeader>Add Category </ModalHeader>
          <ModalBody>
          <p><AiFillRobot size={40}/>{"   "+this.state.Bot_Status}</p>
          <div id="Categorycheck"></div>
            <FormGroup>
              <Label for="name">Name*</Label>
              <InputGroup>
              <Input
                type="text"
                name="name"
                id="Categoryname"
                placeholder="Add category name"
                onChange={this.onChange}
                invalid={this.state.nameInvalid}
              />
              <BsFillMicFill size={30} onClick={this.CallforName}/>
              </InputGroup>
              <FormFeedback>This field is required</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <InputGroup>
              <Input
                type="textarea"
                name="description"
                id="Categorydescription"
                placeholder="Add category description"
                onChange={this.onChange}
              />
              <BsFillMicFill size={30} onClick={this.CallforDescription}/>
               </InputGroup>
            </FormGroup>
            <Collapse isOpen={this.state.catCollapse}>
              <h5>Existing categories</h5>
              <br />
              <ListGroup>
                {categories.map(cat => (
                  <ListGroupItem key={cat._id}>
                    <strong>{cat.name}</strong> - {cat.description}
                    <a
                      className="text-danger float-right"
                      href="#"
                      onClick={this.onDeleteCategory.bind(this, cat._id)}
                    >
                      <MdDelete/>
                    </a>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Collapse>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleCategoryCollapse}>
              Show categories
            </Button>
            <Button color="primary" type="submit">
              Add Category
            </Button>
            <Button color="secondary" onClick={this.props.toggleCategoryModal}>
              Close
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

CategoryModal.propTypes = {
  category: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  category: state.category
});

export default connect(
  mapStateToProps,
  { addCategory, deleteCategory }
)(CategoryModal);
