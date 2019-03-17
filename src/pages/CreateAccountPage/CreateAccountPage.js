import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Form,
  Label,
  Input,
  Button,
  FormGroup
} from "reactstrap";
import Layout from "../../components/Layout/Layout";

import styles from "./CreateAccountPage.module.css";

class CreateAccountPage extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "1984-01-01",
    gender: "male",
    height: 65,
    weight: 160
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.tryLogin({
      email: this.state.email,
      password: this.state.password
    });
    this.setState({
      email: "",
      password: ""
    });
  };

  render() {
    return (
      <Layout>
        <Container className={styles.createContainer}>
          <Row>
            <Col>
              <h1>Create New Account</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                Before you can use ShadowCam will need some health related
                information to ensure accuracy in our calculations.
              </p>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit} className={styles.createForm}>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="email">
                Email
              </Label>
              <Col sm="7" lg="5">
                <Input
                  type="email"
                  required
                  id="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  placeholder="Email address"
                />
              </Col>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="password">
                Password
              </Label>
              <Col sm="7" lg="5">
                <Input
                  type="password"
                  minLength="8"
                  required
                  id="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  placeholder="Password"
                />
              </Col>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="confirmPassword">
                Confirm Password
              </Label>
              <Col sm="7" lg="5">
                <Input
                  type="password"
                  minLength="8"
                  required
                  id="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  placeholder="Confirm Password"
                />
              </Col>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="birthdate">
                Birthdate
              </Label>
              <Col sm="5" md="3">
                <Input
                  type="date"
                  name="birthdate"
                  max={new Date(Date.now()).toISOString().slice(0, 10)}
                  min="1900-01-01"
                  value={this.state.birthdate}
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm="4" lg="3" xl="2">
                Gender
              </Col>
              <FormGroup check>
                <Label sm="4" check>
                  <Input type="radio" name="gender" value="male" checked />
                  Male
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label sm="4" check>
                  <Input type="radio" name="gender" value="female" /> Female
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="height">
                Height (inches)
              </Label>
              <Col sm="5" md="3">
                <Input
                  type="number"
                  min="40"
                  max="100"
                  id="height"
                  value={this.state.height}
                  onChange={this.handleChange}
                  placeholder="Height in inches"
                />
              </Col>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="weight">
                Weight (lbs)
              </Label>
              <Col sm="5" md="3">
                <Input
                  type="number"
                  min="40"
                  max="400"
                  id="weight"
                  value={this.state.weight}
                  onChange={this.handleChange}
                  placeholder="Weight in pounds"
                />
              </Col>
            </FormGroup>
            <Row className={styles.spacer}>
              <Col>
                <Button className={styles.createButton}>Clear</Button>
                <Button className={styles.createButton}>Register</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Layout>
    );
  }
}

export default CreateAccountPage;
