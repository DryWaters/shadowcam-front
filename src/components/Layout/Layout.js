import React from "react";
import Header from "../Header/Header";
import styles from "./Layout.module.css";

const Layout = props => (
  <div className={styles.layoutContainer}>
    <Header />
    {props.children}
  </div>
);

export default Layout;
