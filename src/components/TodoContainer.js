
import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Filters from "./Filters";
import TodoList from "./TodoList";
import TodoModal from "./TodoModal";
import CategoryModal from "./CategoryModal";
import TagModal from "./TagModal";

import { getTodos } from "../actions/todoActions";
import { getCategories } from "../actions/categoriesActions";
import { getTags } from "../actions/tagsActions";

class ToDo extends Component {
  constructor() {
    super();
    this.state = {
      todoModal: false,
      categoryModal: false,
      tagModal: false,
      todoItem: null,
      filter: {
        type: "general",
        value: "all",
        current: "All"
      },
      sortby:"date",
      dropdownOpen: false
    };
  }

  componentDidMount() {
    this.props.getTodos();
    this.props.getCategories();
    this.props.getTags();
  }

  toggleTodoModal = () => {
    this.setState({
      todoModal: !this.state.todoModal,
      todoItem: null
    });
  };
  toggleCategoryModal = () => {
    this.setState({
      categoryModal: !this.state.categoryModal
    });
  };

  toggleTagModal = () => {
    this.setState({
      tagModal: !this.state.tagModal
    });
  };


  editTodo = todo => {
    console.log(todo);
    this.setState(
      {
        todoItem: todo
      },
      () => {
        this.toggleTodoModal();
      }
    );
  };

  controlFilter = (type, value, current) => {
    //console.log('2');
    const newFilter = { type, value, current };
    this.setState({
      filter: newFilter
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {

    return (
      <Container fluid className="custom-fluid">
        <Row>
          <Col>
            <h2 className="font-weight-light">Todo List</h2>
          </Col>
          <Col className="text-right">
            <Button color="dark" onClick={this.toggleTodoModal}>
              Add Todo
            </Button>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm="3" className="filters">
            <Filters
              filter={this.state.filter}
              controlFilter={this.controlFilter}
              toggleCategoryModal={this.toggleCategoryModal}
              categoryModal={this.state.categoryModal}
              toggleTagModal={this.toggleTagModal}
              tagModal={this.state.tagModal}
              sortby={this.state.sortby}
            />
          </Col>
          <Col sm="9">
            <Row>
              <Col>
                <p>
                  Showing: <strong>{this.state.filter.current}</strong>
                </p>
              </Col>
            </Row>
            <TodoList filter={this.state.filter} editTodo={this.editTodo} sortby={this.state.sortby} />
          </Col>
        </Row>
        <TodoModal
          todoItem={this.state.todoItem}
          todoModal={this.state.todoModal}
          toggleTodoModal={this.toggleTodoModal}
          toggleCategoryModal={this.toggleCategoryModal}
          toggleTagModal={this.toggleTagModal}
        />
        <TagModal
          tagModal={this.state.tagModal}
          toggleTagModal={this.toggleTagModal}
        />
        <CategoryModal
          categoryModal={this.state.categoryModal}
          toggleCategoryModal={this.toggleCategoryModal}
        />
      </Container>
    );
  }
}

ToDo.propTypes = {
  getTodos: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  todo: state.todo,
  category: state.category,
  tag: state.tag,
  filter: state.filter
});

export default connect(
  mapStateToProps,
  { getTodos, getCategories, getTags }
)(ToDo);
