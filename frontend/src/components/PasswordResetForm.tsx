import React from "react";
import classnames from "classnames";
import * as EmailValidator from "email-validator";
import Form from "react-bootstrap/Form";
import useForm from "../hooks/useForm";
import { Alert, Button } from "react-bootstrap";

interface PasswordResetFormValues {
  email: string;
}

const initialValues: PasswordResetFormValues = {
  email: "",
};

const validate = (values: any) => {
  const errors = {} as { [key: string]: string };
  const { email } = values;

  if (email === "") {
    errors.email = `Required`;
  } else if (EmailValidator.validate(email) === false) {
    errors.email = `Must be a valid email address`;
  }

  return errors;
};

interface PasswordResetFormProps {
  onSubmit: (values: PasswordResetFormValues) => void;
  className?: string;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  className,
}) => {
  const {
    values,
    errors,
    visibleErrors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useForm(initialValues, onSubmit, validate);

  return (
    <Form
      className={classnames("form-narrow", className)}
      onSubmit={handleSubmit}
    >
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Form.Group controlId="email">
        <Form.Label>Your email address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          isInvalid={visibleErrors.email}
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.email && (
          <Form.Control.Feedback>{errors.email}</Form.Control.Feedback>
        )}
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        data-testid="password-reset-form-submit"
      >
        Reset password
      </Button>
    </Form>
  );
};

export default PasswordResetForm;
