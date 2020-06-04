import React, { Component } from "react";
import { FaFilter,FaTags,FaLayerGroup } from 'react-icons/fa';// for Icons
import {Link} from 'react-router-dom'
import {
Row,
Col,
Button,
ButtonDropdown,
DropdownToggle,
DropdownMenu,
DropdownItem,
Navbar, NavbarBrand, Container} from "reactstrap";

class AppNavbar extends Component {
  state = {
    dropdownOpen: false
  }
  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {
    console.log(localStorage.getItem("image"));
    //navbar shows Login and signup options when user is not logged in otherwise it shows User Profie picture and logout option
    const element=(localStorage.getItem("Token"))?
      ([
        <ButtonDropdown
          size="sm"
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
        >
        <DropdownToggle caret >
        </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="/logout">Logout</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>,
        <img className="navbarimage" src={localStorage.getItem("image")}/>
    ]):
    ([
      <Button href="/login">Login</Button>,
      <Button href="/signup">Signup</Button>
    ])
    return (
      <div>
        <Navbar color="secondary" dark expand="sm">
          <Container fluid>
            <NavbarBrand href="/">
              <span>{"TodoApp"}</span>
            </NavbarBrand>
          </Container>
          {element}
        </Navbar>
      </div>
    );
  }
}

export default AppNavbar;
