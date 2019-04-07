import React, { Component } from "react";
import {
  Button,
  Container,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import { connect } from "react-redux";
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

import { loading, notLoading } from "../../store/actions/ui";
import { tryLogin } from "../../store/actions/user";

import loadingSpinner from "../../assets/images/loading-spinner.gif";
import styles from "./CreateAccountPage.module.css";

const initialState = {
  error: false,
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
  firstName: {
    value: "",
    isValid: false,
    isTouched: false
  },
  lastName: {
    value: "",
    isValid: false,
    isTouched: false
  },
  birthdate: {
    value: "1984-01-01",
    isValid: false,
    isTouched: false
  },
  gender: "m",
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

export class CreateAccountPage extends Component {
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

  // handle checkboxes for gender
  handleChecked = event => {
    this.setState({
      gender: event.target.value
    });
  };

  // handle form submission validation
  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      error: false
    });
    if (this.isValidFields) {
      this.tryRegister({
        email: this.state.email.value,
        password: this.state.password.value,
        firstName: this.state.firstName.value,
        lastName: this.state.lastName.value,
        gender: this.state.gender,
        birthdate: this.state.birthdate.value,
        height: this.state.height.value,
        weight: this.state.weight.value
      });
    }
  };

  tryRegister = userData => {
    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/users/register";
    } else {
      url = `https://shadowcam-back.herokuapp.com/users/register`;
    }

    this.props.loading();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(parsedRes => {
        if (parsedRes.status === "ok") {
          this.props.tryLogin({
            email: userData.email,
            password: userData.password
          });
        } else {
          this.setState({
            error: true
          });
          return this.props.notLoading();
        }
      })
      .catch(err => {
        alert(
          "Unable to connect to server.  Please check internet connection."
        );
      });
  };

  // clear all input fields
  handleClear = () => {
    this.setState({ ...initialState });
  };

  // verifies that all form fields are valid before submitting
  isValidFields = () =>
    this.state.email.isValid &&
    this.state.password.isValid &&
    this.state.confirmPassword.isValid &&
    this.state.firstName.isValid &&
    this.state.lastName.isValid &&
    this.state.birthdate.isValid &&
    this.state.height.isValid &&
    this.state.weight.isValid;

  render() {
    const shouldDisplayButton = () => {
      if (this.props.isLoading) {
        return (
          <Button disabled className={styles.createButton}>
            <img
              src={loadingSpinner}
              alt="Loading Spinner"
              className={styles.loadingSpinner}
            />
          </Button>
        );
      } else {
        return <Button className={styles.createButton}>Register</Button>;
      }
    };

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
          <Row>
            <Col>
              {this.state.error ? (
                <span className={styles.errorMessage}>
                  Email has already been used. Have you already registered?
                </span>
              ) : (
                ""
              )}
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
                  value={this.state.email.value}
                  onChange={this.handleChange}
                  placeholder="Email address"
                  spellCheck="false"
                  className={
                    !this.state.email.isValid && this.state.email.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
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
              <Label sm="4" lg="3" xl="2" for="firstName">
                First Name
              </Label>
              <Col sm="5" md="3">
                <Input
                  type="text"
                  id="firstName"
                  maxLength="50"
                  value={this.state.firstName.value}
                  onChange={this.handleChange}
                  className={
                    !this.state.firstName.isValid &&
                    this.state.firstName.isTouched
                      ? `${styles.invalidInput}`
                      : ""
                  }
                />
              </Col>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="4" lg="3" xl="2" for="lastName">
                Last Name
              </Label>
              <Col sm="5" md="3">
                <Input
                  type="text"
                  id="lastName"
                  maxLength="50"
                  value={this.state.lastName.value}
                  onChange={this.handleChange}
                  className={
                    !this.state.lastName.isValid &&
                    this.state.lastName.isTouched
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
                    checked={this.state.gender === "m" ? "checked" : ""}
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
                    checked={this.state.gender === "f" ? "checked" : ""}
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
                <Button
                  className={styles.createButton}
                  onClick={this.handleClear}
                >
                  Clear
                </Button>
                {shouldDisplayButton()}
              </Col>
            </Row>
          </Form>
        </Container>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loading: () => dispatch(loading()),
  notLoading: () => dispatch(notLoading()),
  tryLogin: authData => dispatch(tryLogin(authData))
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccountPage);
