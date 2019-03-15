import React from "react";
import { Container, Row } from "reactstrap";
import styles from "./LandingPage.module.css";
import Layout from "../../components/Layout/Layout";

const LandingPage = () => (
  <Layout>
    <Container className={styles.landingContainer}>
      <Row>
        <h1>Hi from LandingPage</h1>
      </Row>
    </Container>
  </Layout>
);

export default LandingPage;
