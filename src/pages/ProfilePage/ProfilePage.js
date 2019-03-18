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

import validator from "../../utils/validation";
import {
  MAX_HEIGHT,
  MAX_WEIGHT,
  MIN_HEIGHT,
  MIN_WEIGHT,
  MIN_YEAR,
  MAX_YEAR
} from "../../utils/constants";
import styles from "./ProfilePage.module.css";

const initialState = {
  email: {
    value: "",
    isValid: false,
    isTouched: false
  },
  password: {
    value: "",
    isValid: false,
    isTouched: false,
    minChars: false,
    hasNumber: false,
    hasUpper: false,
    hasLower: false,
    hasSymbol: false
  },
  confirmPassword: {
    value: "",
    isValid: false,
    isTouched: false
  },
  birthdate: {
    value: "1984-01-01",
    isValid: false,
    isTouched: false
  },
  gender: "male",
  height: {
    value: 65,
    isValid: false,
    isTouched: false
  },
  weight: {
    value: 160,
    isValid: false,
    isTouched: false
  }
};

class ProfilePage extends Component {
  state = initialState;

  // handles validation of input fields
  handleChange = event => {
    const newValue = {};

    // check different parts of password requirements
    if (event.target.id === "password") {
      newValue.password = { ...this.state.password };
      newValue.confirmPassword = { ...this.state.confirmPassword };

      newValue.password.value = event.target.value;
      newValue.password.isValid = validator[event.target.id](
        event.target.value
      );
      newValue.password.minChars = validator.passwordValidators.minChars(
        event.target.value
      );
      newValue.password.hasNumber = validator.passwordValidators.hasNumber(
        event.target.value
      );
      newValue.password.hasUpper = validator.passwordValidators.hasUpper(
        event.target.value
      );
      newValue.password.hasLower = validator.passwordValidators.hasLower(
        event.target.value
      );
      newValue.password.hasSymbol = validator.passwordValidators.hasSymbol(
        event.target.value
      );
      newValue.password.isTouched = true;

      newValue.confirmPassword.isValid = validator.confirmPassword(
        event.target.value,
        this.state.confirmPassword.value
      );
    } else if (event.target.id === "confirmPassword") {
      newValue.confirmPassword = { ...this.state.confirmPassword };
      newValue.confirmPassword.value = event.target.value;
      newValue.confirmPassword.isValid = validator.confirmPassword(
        event.target.value,
        this.state.password.value
      );
      newValue.confirmPassword.isTouched = true;
    } else {
      newValue[event.target.id] = { ...this.state[event.target.id] };
      newValue[event.target.id].value = event.target.value;
      newValue[event.target.id].isValid = validator[event.target.id](
        event.target.value
      );
      newValue[event.target.id].isTouched = true;
    }

    this.setState({
      ...newValue
    });
  };

  handleChecked = event => {
    this.setState({
      gender: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState(initialState);
  };

  render() {
    return (
      <Layout>
        <Container className={styles.profileContainer
        }>
          <Row>
            <Col>
              <h1>My Account</h1>
            </Col>
          </Row>
          <FormGroup row className={styles.spacer}>
            <Label sm="4" lg="3" xl="2" for="email">
              Email
              </Label>
            <Col sm="7" lg="5">
              <Input
                type="email"
                required
                id="email"
                value={this.state.email.value}
                onChange={this.handleChange}
                placeholder="Email address"
                spellCheck="false"
                className={
                  !this.state.email.isValid && this.state.email.isTouched
                    ? `${styles.invalidInput}`
                    : ""
                }
                disabled
              />
            </Col>
          </FormGroup>
          <Form onSubmit={this.handleSubmit} className={styles.profileForm}>
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
                  value={this.state.password.value}
                  onChange={this.handleChange}
                  placeholder="Password"
                  className={
                    !this.state.password.isValid &&
                      this.state.password.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
                />
                <div className={styles.passwordHelpers}>
                  {this.state.password.minChars ? (
                    ""
                  ) : (
                      <p>Minimum is 8 characters</p>
                    )}
                  {this.state.password.hasNumber ? "" : <p>Contain a number</p>}
                  {this.state.password.hasLower &&
                    this.state.password.hasUpper ? (
                      ""
                    ) : (
                      <p>Upper and lower case characters</p>
                    )}
                  {this.state.password.hasSymbol ? (
                    ""
                  ) : (
                      <p>One symbol: [!@#$%^&*-]</p>
                    )}
                </div>
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
                  value={this.state.confirmPassword.value}
                  onChange={this.handleChange}
                  placeholder="Confirm Password"
                  className={
                    !this.state.confirmPassword.isValid &&
                      this.state.confirmPassword.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
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
                  id="birthdate"
                  max={`${MAX_YEAR}-0101`}
                  min={`${MIN_YEAR}-01-01`}
                  value={this.state.birthdate.value}
                  onChange={this.handleChange}
                  className={
                    !this.state.birthdate.isValid &&
                      this.state.birthdate.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm="4" lg="3" xl="2">
                Gender
              </Col>
              <FormGroup check>
                <Label sm="4" check>
                  <Input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={this.handleChecked}
                    checked={this.state.gender === "male" ? "checked" : ""}
                  />
                  Male
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label sm="4" check>
                  <Input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={this.handleChecked}
                    checked={this.state.gender === "female" ? "checked" : ""}
                  />{" "}
                  Female
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
                  min={MIN_HEIGHT}
                  max={MAX_HEIGHT}
                  id="height"
                  value={this.state.height.value}
                  onChange={this.handleChange}
                  placeholder="Height in inches"
                  className={
                    !this.state.height.isValid && this.state.height.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
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
                  min={MIN_WEIGHT}
                  max={MAX_WEIGHT}
                  id="weight"
                  value={this.state.weight.value}
                  onChange={this.handleChange}
                  placeholder="Weight in pounds"
                  className={
                    !this.state.weight.isValid && this.state.weight.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
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

export default ProfilePage;
