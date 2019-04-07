import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout/Layout";

import { tryLogin } from "../../store/actions/user";

import loadingSpinner from "../../assets/images/loading-spinner.gif";
import styles from "./LoginPage.module.css";

export class LoginPage extends Component {
  state = {
    email: "",
    password: "",
    isSubmitted: false
  };

  // handle input change
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
      isSubmitted: false
    });
  };

  // handle form submission
  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      isSubmitted: true
    });
    this.props.tryLogin({
      email: this.state.email,
      password: this.state.password
    });
  };

  render() {
    const shouldDisplayButton = () => {
      if (this.props.isLoading) {
        return (
          <Button disabled className={styles.loginButton}>
            <img
              src={loadingSpinner}
              alt="Loading Spinner"
              className={styles.loadingSpinner}
            />
          </Button>
        );
      } else {
        return <Button className={styles.loginButton}>Log in</Button>;
      }
    };
    return (
      <Layout>
        <Container className={styles.loginContainer}>
          <Row className={styles.spacer}>
            <Col>
              <h2>Log in</h2>
            </Col>
          </Row>
          <Row>
            <Col className={styles.spacer} sm="12" md="8">
              <p>Sign in with your email and password.</p>
              <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                  <Label sm="3" lg="2" for="email">
                    Email
                  </Label>
                  <Col sm="6">
                    <Input
                      type="email"
                      required
                      id="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      placeholder="Email address"
                      className={
                        !this.props.isAuth &&
                        this.state.isSubmitted &&
                        !this.props.isLoading
                          ? styles.shake
                          : ""
                      }
                    />
                  </Col>
                </FormGroup>
                <FormGroup row className={styles.spacer}>
                  <Label sm="3" lg="2" for="password">
                    Password
                  </Label>
                  <Col sm="6">
                    <Input
                      type="password"
                      minLength="8"
                      required
                      id="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      placeholder="Password"
                      className={
                        !this.props.isAuth &&
                        this.state.isSubmitted &&
                        !this.props.isLoading
                          ? styles.shake
                          : ""
                      }
                    />
                  </Col>
                  {/* Place for forgot password logic page
                     <Label sm="3">
                    <Link to="/account/forgot">Forgot Password?</Link>
                  </Label> */}
                </FormGroup>
                <FormGroup className={styles.spacer}>
                  {shouldDisplayButton()}
                </FormGroup>
              </Form>
            </Col>
            <Col sm="12" md="4">
              <p>
                If you don't have an account you can make one now. It's free!
              </p>
              <Link to="/account/create">
                <Button className={styles.loginButton}>Create Account</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  tryLogin: authData => dispatch(tryLogin(authData))
});

const mapStateToProps = state => ({
  invalidLogin: state.user.invalidLogin,
  isAuth: state.user.isAuth,
  isLoading: state.ui.isLoading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
