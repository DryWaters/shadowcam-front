import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Button,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { NavLink as NvLink, Link } from "react-router-dom";
import { logout } from "../../store/actions/user";

import styles from "./Header.module.css";
import logo from "../../assets/images/boxer-header.png";

export class Header extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const loginDropdown = (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle caret>Account</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem className={styles.dropdownItem}>
            <Link to="/account/profile">Account Settings</Link>
          </DropdownItem>
          <DropdownItem
            className={styles.dropdownItem}
            onClick={this.props.logout}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );

    const unauthLogin = (
      <Link to="/account/login">
        <Button>Login</Button>
      </Link>
    );

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
                {this.props.isAuth && (
                  <NvLink to="/recordings/newRecording">
                    <NavLink>New Recording</NavLink>
                  </NvLink>
                )}
              </NavItem>
              <NavItem className={styles.menuItem}>
                {this.props.isAuth && (
                  <NvLink to="/recordings/pastRecordings">
                    <NavLink>Past Recordings</NavLink>
                  </NvLink>
                )}
              </NavItem>
              {!this.props.isAuth ? unauthLogin : loginDropdown}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.user.isAuth
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
