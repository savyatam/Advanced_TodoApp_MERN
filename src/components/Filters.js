
import React, { Component } from "react";
import { Nav, NavItem, NavLink, Badge,Button,DropdownMenu,
DropdownItem } from "reactstrap";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FaFilter,FaTags,FaLayerGroup } from 'react-icons/fa';
import { GrSort,GrAdd } from "react-icons/gr";
import {MdAddCircleOutline} from "react-icons/md";
class Filters extends Component {
  state = {
    currentFilter: "All"
  };

  getCategoryCount = (categoryId, todos) => {
    const todoCount = todos.filter(x => x.category === categoryId).length;
    return todoCount;
  };

  getCompletedCount = todos => {
    const todoCompletedCount = todos.filter(x => x.completed === true).length;
    return todoCompletedCount;
  };

  getActiveCount = todos => {
    const todoActiveCount = todos.filter(x => x.completed === false).length;
    return todoActiveCount;
  };

  onFilterChange = (type, value, current) => {
    console.log('1');
    this.setState({
      currentFilter: current
    });
    this.props.controlFilter(type, value, current);
  };
  SortbyDate=todos=>{
  console.log('SortbyDate');
  }
  SortbyName=todos=>{
 console.log('SortbyName');
  }
  SortbydueDate=todos=>{
 console.log('SortbydueDate');
  }
  render() {
    const { todos } = this.props.todo;
    const { categories } = this.props.category;
    const { tags } = this.props.tag;
    return (
      <div>
        <p>
        <FaFilter />
            Filters
        </p>
        <Nav vertical>
          <NavItem>
            <NavLink
              href="#"
              onClick={() => this.onFilterChange("general", "all", "All")}
              active={this.state.currentFilter === "All"}
            >
              All{" "}
              <span className="float-right">
                <Badge pill>{todos.length}</Badge>
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              onClick={() => this.onFilterChange("completed", false, "Active")}
              active={this.state.currentFilter === "Active"}
            >
              Active{" "}
              <span className="float-right">
                <Badge pill>{this.getActiveCount(todos)}</Badge>
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              onClick={() =>
                this.onFilterChange("completed", true, "Completed")
              }
              active={this.state.currentFilter === "Completed"}
            >
              Completed{" "}
              <span className="float-right">
                <Badge pill>{this.getCompletedCount(todos)}</Badge>
              </span>
            </NavLink>
          </NavItem>
        </Nav>
        <hr />
        <p>
        <GrSort/>
           SortBy
        </p>
        <Nav vertical>
            <NavItem >
              <NavLink href="#"
                onClick={() =>this.onFilterChange("SortbyDate", false, "SortbyDate")}
              >
                SortbyDate
              </NavLink>
            </NavItem>
            <NavItem >
              <NavLink href="#"
                onClick={() =>this.onFilterChange("SortbydueDate", false, "SortbydueDate")}>
                SortbydueDate
              </NavLink>
            </NavItem>
            <NavItem >
              <NavLink href="#"
                onClick={() =>this.onFilterChange("SortbyName", false, "SortbyName")}>
                SortbyName
              </NavLink>
            </NavItem>

        </Nav>



        <hr />
        <p> <FaLayerGroup/>
           Categories{" "}
          <a href="#" className="float-right" onClick={this.props.toggleCategoryModal}>
            <GrAdd/>
          </a>
        </p>
        <Nav vertical>
          {categories.map(cat => (
            <NavItem key={cat._id}>
              <NavLink
                href="#"
                onClick={() =>
                  this.onFilterChange("category", cat._id, cat.name)
                }
                active={this.state.currentFilter === cat.name}
              >
                {cat.name}
                <span className="float-right">
                  <Badge pill>{this.getCategoryCount(cat._id, todos)}</Badge>
                </span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <hr />
        <p>
        <FaTags/>
         Tags{" "}
          <a href="#" className="float-right" onClick={this.props.toggleTagModal}>
            <GrAdd/>
          </a>
        </p>
        {tags.map(tag => (
          <a
            key={tag._id}
            href="#"
            className={`tags-list ${
              this.state.currentFilter === tag.name ? "active" : ""
            }`}
            onClick={() => this.onFilterChange("tag", tag._id, tag.name)}
          >
            <Badge pill>{tag.name}</Badge>
          </a>
        ))}
        <p><br/></p>
      </div>
    );
  }
}

Filters.propTypes = {
  todo: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  tag: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  todo: state.todo,
  category: state.category,
  tag: state.tag
});

export default connect(mapStateToProps)(Filters);
