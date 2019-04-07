import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Collapse,
  Container,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown
} from "reactstrap";
import { Link, NavLink } from "react-router-dom";

import { logout } from "../../store/actions/user";

import logo from "../../assets/images/boxer-header.png";
import styles from "./Header.module.css";

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
                  <NavLink to="/workouts/newWorkout">New Workout</NavLink>
                )}
              </NavItem>
              <NavItem className={styles.menuItem}>
                {this.props.isAuth && (
                  <NavLink to="/workouts/pastWorkouts">Past Workouts</NavLink>
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
