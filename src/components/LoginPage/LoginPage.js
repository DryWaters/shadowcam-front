import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

const LoginPage = () => (
  <div>
    <h1>Hi from Login Page</h1>
    <Button>
      <Link to="/initial">Click me</Link>
    </Button>
  </div>
);

export default LoginPage;
