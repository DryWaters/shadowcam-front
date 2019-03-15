import React from "react";
import Layout from "../Layout/Layout";
import { Container, Col, Row } from "reactstrap";

import styles from "./NotFound.module.css";

const NotFound = () => (
  <Layout>
    <div className={styles.notFoundBackground}>
      <Container className={styles.notFoundContainer}>
        <div>
          <p className={styles.errorHeader}>Error 404</p>
        </div>
        <div>
          <h2>Oops! It looks like this page was knocked out!</h2>
          <h4>Please check the URL and try again.</h4>
        </div>
      </Container>
    </div>
  </Layout>
);

export default NotFound;
