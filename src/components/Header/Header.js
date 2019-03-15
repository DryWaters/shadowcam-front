import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link, NavLink as NavLk } from "react-router-dom";

import styles from "./Header.module.css";
import logo from "../../assets/images/boxer-header.png";

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <Navbar className={styles.headerContainer} color="dark" dark expand="md">
        <Container>
          <Link className={styles.logoLink} to="/">
            <img src={logo} alt="Logo" />
            <span className={styles.logo}>ShadowCam</span>
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className={styles.menuItems} navbar>
              <NavItem className={styles.menuItem}>
                {this.props.isAuth && <NavLink>New Recording</NavLink>}
              </NavItem>
              <NavItem className={styles.menuItem}>
                {this.props.isAuth && <NavLink>Past Recordings</NavLink>}
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle caret>Login</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>My Account</DropdownItem>
                  <DropdownItem>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

export default connect(mapStateToProps)(Header);
