import React from "react";
import * as EmailValidator from "email-validator";
import { useForm } from "../form/form";
import { Alert, Button, Form } from "react-bootstrap";
import { isEmpty } from "lodash";

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
  const {
    values,
    errors,
    visibleErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    initialValues,
    ({ email, password }) => {
      onSubmit(email, password);
    },
    validate
  );

  return (
    <Form className="form-narrow" onSubmit={handleSubmit}>
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          isInvalid={visibleErrors.email}
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.email && (
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          isInvalid={visibleErrors.password}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.password && (
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        data-testid="login-form-submit"
        disabled={pending || !isEmpty(errors)}
      >
        {pending ? `Logging in` : `Log in`}
      </Button>
    </Form>
  );
};

export default LoginForm;
