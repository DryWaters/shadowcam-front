import React from "react";
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
import Layout from "../../components/Layout/Layout";

import styles from "./LoginPage.module.css";

const LoginPage = () => (
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
          <Form>
            <FormGroup row>
              <Label sm="3" lg="2">Email</Label>
              <Col sm="6">
                <Input />
              </Col>
            </FormGroup>
            <FormGroup row className={styles.spacer}>
              <Label sm="3" lg="2">Password</Label>
              <Col sm="6">
                <Input />
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
          <p>If you don't have an account you can make one now. It's free!</p>
          <Link to="/account/create">
            <Button className={styles.loginButton}>Create Account</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  </Layout>
);

export default LoginPage;
