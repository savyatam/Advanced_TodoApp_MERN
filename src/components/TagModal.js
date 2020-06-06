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
import { addTag, deleteTag } from "../actions/tagsActions";
import {BsFillMicFill,BsFillMicMuteFill} from "react-icons/bs";
import {FaLayerGroup,FaTags,FaRobot} from "react-icons/fa";
import {GrAddCircle} from "react-icons/gr";
import {AiFillRobot} from "react-icons/ai";

const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'

class TagModal extends Component {
  state = {
    tagCollapse: false,
    nameInvalid: false,
    name: "",
    description: "",
    listening: false,
    Input_id:"Tagname",
    Bot_Status:"Not Listening"
  };

  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen() {
    const Input_id_value=this.state.Input_id;
    console.log(Input_id_value);
    console.log('listening?', this.state.listening)

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
      this.setState({Bot_Status:"Listening........."})
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('checkTag').innerHTML = interimTranscript
      document.getElementById(Input_id_value).value = finalTranscript
      if(Input_id_value=="Tagname")
      this.setState({ name:finalTranscript});
      if(Input_id_value==="Tagdescription")
      this.setState({ description:finalTranscript});

    ////If u want to stop recording using command uncomment this.Say "stop listening" to stop recording

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



    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }

  }

  CallforName=e=>{
    e.preventDefault();
    this.setState({
      Input_id: "Tagname"
    }, this.toggleListen)
  }
   CallforDescription=e=>{
     e.preventDefault();
     this.setState({
       Input_id: "Tagdescription"
     }, this.toggleListen)
   }

  toggleTagCollapse = () => {
    this.setState({
      tagCollapse: !this.state.tagCollapse
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onTagSubmited = e => {
    e.preventDefault();
    if(this.state.name === "") {
      this.setState({
        nameInvalid: true
      })
    } else {
      this.setState({
        nameInvalid: false
      }, () => {
        const newTag = {
          _id: uuid(),
          name: this.state.name,
          description: this.state.description
        };
        // Add todo via newCategory action
        this.props.addTag(newTag);

        /* Close category modal */
        this.props.toggleTagModal();
      })
    }
  };

  onDeleteTag = id => {
    this.props.deleteTag(id);
  };

  render() {
    const { tags } = this.props.tag;
    return (
      <Modal isOpen={this.props.tagModal} toggle={this.props.toggleTagModal}>
        <Form onSubmit={this.onTagSubmited}>
          <ModalHeader>Add Tag </ModalHeader>
          <ModalBody>
          <p><AiFillRobot size={40}/>{"   "+this.state.Bot_Status}</p>
          <div id="checkTag"></div>
            <FormGroup>
              <Label for="name">Name*</Label>
              <InputGroup>
              <Input
                type="text"
                name="name"
                id="Tagname"
                placeholder="Add tag name"
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
                id="Tagdescription"
                placeholder="Add tag description"
                onChange={this.onChange}
              />
              <BsFillMicFill size={30} onClick={this.CallforDescription}/>

               </InputGroup>
            </FormGroup>
            <Collapse isOpen={this.state.tagCollapse}>
              <h5>Existing tags</h5>
              <br />
              <ListGroup>
                {tags.map(tag => (
                  <ListGroupItem key={tag._id}>
                    <strong>{tag.name}</strong> - {tag.description}
                    <a
                      className="text-danger float-right"
                      href="#"
                      onClick={this.onDeleteTag.bind(this, tag._id)}
                    >
                      <MdDelete/>
                    </a>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Collapse>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleTagCollapse}>
              Show existing tags
            </Button>
            <Button color="primary" type="submit">
              Add Tag
            </Button>
            <Button color="secondary" onClick={this.props.toggleTagModal}>
              Close
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

TagModal.propTypes = {
  tag: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tag: state.tag
});

export default connect(
  mapStateToProps,
  { addTag, deleteTag }
)(TagModal);
