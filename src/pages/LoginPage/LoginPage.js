import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  FormGroup
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { tryLogin } from "../../store/actions/auth";

import styles from "./LoginPage.module.css";

class LoginPage extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.tryLogin({
      email: this.state.email,
      password: this.state.password
    });
    this.setState({
      email: '',
      password: ''
    })
  };

  render() {
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
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      placeholder="Email address"
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
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      placeholder="Password"
                    />
                  </Col>
                  <Label sm="3">
                    <Link to="/account/forgot">Forgot Password?</Link>
                  </Label>
                </FormGroup>
                <FormGroup className={styles.spacer}>
                  <Button className={styles.loginButton}>Log In</Button>
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

export default connect(
  null,
  mapDispatchToProps
)(LoginPage);
