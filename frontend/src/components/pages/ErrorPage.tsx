import * as React from "react";
import { Alert } from "react-bootstrap";

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => (
  <div className="page">
    <div className="container">
      <Alert variant="danger" className="my-3">
        <h1>Oops!</h1>
        <p>{message}</p>
      </Alert>
    </div>
  </div>
);

export default ErrorPage;
