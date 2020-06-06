import React, { Component } from "react";
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
  Badge,
  Col
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//________________________________Icons______________________________
import {BsFillMicFill,BsFillMicMuteFill} from "react-icons/bs";
import {FaLayerGroup,FaTags,FaRobot} from "react-icons/fa";
import {GrAddCircle} from "react-icons/gr";
import {AiFillRobot} from "react-icons/ai";


import Select from "react-select";
import uuid from "uuid";
import { addTodo, updateTodo } from "../actions/todoActions";

//____________________________________Speech recognition_________________________
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'




class TodoModal extends Component {
  constructor() {
    super();

    this.state = {
      nameInvalid: false,
      todoItem: {
        _id: null,
        name: "",
        description: "",
        category: null,
        tags: [],
        dueDate: new Date(),
        date: null,
        completed: null
      },
        listening: false,
        Input_id:"name",
        Bot_Status:"Not listening"
    };
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
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
        //console.log("...continue listening...")
        this.setState({Bot_Status:"...continue listening..."})
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        //console.log("Stopped listening per click")
        this.setState({Bot_Status:"Not listening"})
      }
    }

    recognition.onstart = () => {
      //console.log("Listening!")
      this.setState({Bot_Status:"Listening..........."})
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('check').innerHTML = interimTranscript
      document.getElementById(Input_id_value).value = finalTranscript
      let todoItem = Object.assign({}, this.state.todoItem);    //creating copy of object
      todoItem[Input_id_value] = finalTranscript;

      this.setState({ todoItem });


    }

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
      this.setState({Bot_Status:"Error occurred in recognition: "+event.error});

    }

  }

  CallforName=e=>{
    e.preventDefault();
    this.setState({
      Input_id: "name"
    }, this.toggleListen)//keeping track of id to differentiate the inputs while filling text obtained from SpeechRecognition
  }
   CallforDescription=e=>{
     e.preventDefault();
     this.setState({
       Input_id: "description"
     }, this.toggleListen)//keeping track of id to differentiate the inputs while filling text obtained from SpeechRecognition
   }
  onInputChange = e => {
    let todoItem = Object.assign({}, this.state.todoItem);    //creating copy of object
    todoItem[e.target.name] = e.target.value;

    this.setState({ todoItem });
  };


  onCategoryChange = e => {
    let todoItem = Object.assign({}, this.state.todoItem);    //creating copy of object
    todoItem.category = e.value;
    this.setState({
      todoItem
    });
  };

  onTagsChange = e => {
    let todoItem = Object.assign({}, this.state.todoItem);    //creating copy of object
    todoItem.tags = e;
    this.setState({
      todoItem
    });
  };

  onTodoSubmited = e => {
    e.preventDefault();
    if (this.state.todoItem.name === "") {
      this.setState({
        nameInvalid: true
      });
    } else {
      this.setState(
        {
          nameInvalid: false
        },
        () => {
          const {_id, name, description, category, tags, dueDate, date, completed} = this.state.todoItem;
          const todo = {
            _id: _id == null ? uuid() : _id,
            name,
            description,
            category,
            tags,
            dueDate: new Date(dueDate),
            date: date == null ? new Date() : new Date(date),
            completed: completed == null ? false : completed
          };
          if(this.state.todoItem._id === null){
            this.props.addTodo(todo);
          } else {
            this.props.updateTodo(todo);
          }


         this.props.toggleTodoModal();
        const todoItemsamp= {
           _id: null,
           name: "",
           description: "",
           category: null,
           tags: [],
           dueDate: new Date(),
           date: null,
           completed: null
         }
         this.setState({todoItem:todoItemsamp});
        }
      );
    }
  };

  onTodoModalClose = () => {
    this.setState({
      todoItem: {
        _id: null,
        name: "",
        description: "",
        category: "",
        tags: [],
        dueDate: new Date(),
        date: null,
        completed: null
      }
    })

    this.props.toggleTodoModal();
  }

  componentDidUpdate(prevProps, prevState) {
   if (prevProps.todoItem != null) {

      const { _id, name, description, category, tags, dueDate, date, completed } = prevProps.todoItem;
      const data={_id,
      name,
      description,
      category,
      tags,
      dueDate,
      date,
      completed
    };

     this.state.todoItem=data;
     this.setState({todoItem:this.state.todoItem})
     //console.log(this.state);
    }
  }


  render() {
    const { categories } = this.props.category;
    const catOptions = categories.map(category => {
      return { value: category._id, label: category.name };
    });

    const { tags } = this.props.tag;
    const tagsOptions = tags.map(tag => {
      return { value: tag._id, label: tag.name };
    });

   let selectedTags=""
   if(this.state.todoItem.tags!==null)
   selectedTags = this.state.todoItem.tags.length > 0 ?this.state.todoItem.tags : "";

    return (
      <div>

        <Modal
          isOpen={this.props.todoModal}
          toggle={this.onTodoModalClose}
        >
          <ModalHeader toggle={this.toggleToDo}>{this.state.todoItem._id !== null ? "Update " + this.state.todoItem.name : "Add Todo"}</ModalHeader>

          <Form onSubmit={this.onTodoSubmited}>
            <ModalBody>
              <Row>
                <Col>
                <p><AiFillRobot size={40}/>{"   "+this.state.Bot_Status}</p>
                <div id="check"></div>
                  <FormGroup>
                    <Label for="name">Name*</Label>
                    <InputGroup>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Add todo name"
                      value={this.state.todoItem.name}
                      onChange={this.onInputChange.bind(this)}
                      invalid={this.state.nameInvalid}
                    />

                    <BsFillMicFill size={30} onClick={this.CallforName}/>

                    </InputGroup>
                    <FormFeedback>This field is required</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <InputGroup>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      placeholder="Add todo descrption"
                      value={this.state.todoItem.description}
                      onChange={this.onInputChange}
                    />

                    <BsFillMicFill size={30} onClick={this.CallforDescription}/>

                     </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="category">Category</Label>
                    <InputGroup>
                      <Select
                        value={catOptions.find(option => option.value === this.state.todoItem.category)}
                        name="category"
                        id="category"
                        onChange={this.onCategoryChange}
                        options={catOptions}
                      />
                      <InputGroupAddon addonType="append">
                      <GrAddCircle size={40}
                        onClick={this.props.toggleCategoryModal}/>

                      </InputGroupAddon>

                    </InputGroup>

                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="tags">Tags</Label>
                    <InputGroup>
                      <Select
                        value={selectedTags}
                        isMulti
                        name="tags"
                        id="tags"
                        onChange={this.onTagsChange}
                        options={tagsOptions}
                      />
                      <InputGroupAddon addonType="append">
                        <GrAddCircle size={40}
                          onClick={this.props.toggleTagModal}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="dueDate">Due Date</Label>
                    <Input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      placeholder="Add todo due date"
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addNewTodo}>
                {this.state.todoItem._id !== null ? "Update" : "Submit"}
              </Button>
              <Button color="secondary" onClick={this.onTodoModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

TodoModal.propTypes = {
  todo: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  tag: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  todo: state.todo,
  category: state.category,
  tag: state.tag
});

export default connect(
  mapStateToProps,
  { addTodo, updateTodo }
)(TodoModal);
