import React from "react";
import * as EmailValidator from "email-validator";
import { useForm } from "../form/form";
import { Button, Form } from "react-bootstrap";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  pending?: boolean;
}

const validate = (values: any) => {
  const errors = {} as { [key: string]: string };
  const { email, password } = values;

  if (email === "") {
    errors.email = `Required`;
  } else if (EmailValidator.validate(email) === false) {
    errors.email = `Must be a valid email address`;
  }

  if (password === "") {
    errors.password = `Required`;
  }

  return errors;
};

const initialValues = {
  email: "",
  password: "",
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, pending }) => {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    initialValues,
    ({ email, password }) => {
      onSubmit(email, password);
    },
    validate
  );

  return (
    <Form className="form-narrow" onSubmit={handleSubmit}>
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && (
          <Form.Control.Feedback className="invalid-feedback">
            {errors.email}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && (
          <Form.Control.Feedback className="invalid-feedback">
            {errors.password}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        data-testid="login-form-submit"
        disabled={pending}
      >
        {pending ? `Logging in` : `Log in`}
      </Button>
    </Form>
  );
};

export default LoginForm;
