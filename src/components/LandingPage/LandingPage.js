import React from "react";
import { Container, Row, Col } from "reactstrap";
import styles from "./LandingPage.module.css";
import Layout from "../Layout/Layout";

const LandingPage = () => (
  <Layout>
    <Container className={styles.container}>
      <Row>
        <h1>Hi from LandingPage</h1>
      </Row>
    </Container>
  </Layout>
);

export default LandingPage;
