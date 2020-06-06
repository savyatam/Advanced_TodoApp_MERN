import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteTodo, updateTodo } from "../actions/todoActions";

import { ListGroup } from "reactstrap";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import TodoItem from "./TodoItem";

class TodoList extends Component {
  constructor(){
    super();
    this.state = {
      filteredTodos: [],
      filter: {}
    }
  }
  onDeleteClick = id => {
    this.props.deleteTodo(id);
  };

  onCompleteClick = (todo, completed) => {
    todo.completed = !completed;
    this.props.updateTodo(todo);
  };

  getCategoryName = (categoryId, categories) => {
    const cat = categories.find(x => x._id === categoryId);
    if (typeof cat !== "undefined") {
      return cat["name"];
    }
  };

  getTagName = (tagId, tags) => {
    const tag = tags.find(x => x._id === tagId);
    if (typeof tag !== "undefined") {
      return tag["name"];
    }
  };

  getDateState = date => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() > today.getTime()) {
      return "text-primary";
    } else if (dueDate.getTime() === today.getTime()) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };



  render() {
    const { todos } = this.props.todo;
    //console.log(this.props);
    let type = this.props.filter.type;
    let value = this.props.filter.value;
    let filter = todos.filter(todo => {
      if (type === "general" && value === "all") {
        // return all
        return todo;
      }
      else if (type === "tag") {
        // search by tags
        let tags=todo.tags;
        let hasTag = tags.filter(x => x.value === value).length !== 0;
        if (hasTag) {
          return todo;
        }
      } else if(type!=="SortbyDate") {
        return todo[type] === value;
      }
    });
    if(this.props.filter.type==="SortbyDate")
       {filter=todos;
         filter.sort(function(a, b) {
       var dateA = new Date(a.date);
       var dateB = new Date(b.date);

       if (dateA.getTime() < dateB.getTime()) {

         return -1;
       }
       if (dateA.getTime() > dateB.getTime()) {
         return 1;
       }


       return 0;
     });
       }

       if(this.props.filter.type==="SortbydueDate")
          {filter=todos;
            filter.sort(function(a, b) {
          var dateA = new Date(a.dueDate);
          var dateB = new Date(b.dueDate);

          if (dateA.getTime() < dateB.getTime()) {

            return -1;
          }
          if (dateA.getTime() > dateB.getTime()) {
            return 1;
          }


          return 0;
        });
          }
          if(this.props.filter.type==="SortbyName")
             {
               filter=todos;
               filter.sort(function(a, b) {
             var nameA = a.name.toUpperCase(); // ignore upper and lowercase
             var nameB = b.name.toUpperCase(); // ignore upper and lowercase
             if (nameA < nameB) {
               return -1;
             }
             if (nameA > nameB) {
               return 1;
             }

             // names must be equal
             return 0;
           });
             }

    return (
      <ListGroup className="todo">
      <TransitionGroup className="todo__list">
            {filter.map(todoItem => (
              <CSSTransition key={todoItem._id} timeout={500} classNames="fade">
                <TodoItem
                  todoItem={todoItem}
                  editTodo={this.props.editTodo}
                  />
              </CSSTransition>
            ))}
      </TransitionGroup>
      </ListGroup>
    );
  }
}

TodoList.propTypes = {
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
  { deleteTodo, updateTodo }
)(TodoList);
