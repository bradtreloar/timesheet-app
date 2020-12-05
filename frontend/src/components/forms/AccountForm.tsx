import React from "react";
import * as EmailValidator from "email-validator";
import classnames from "classnames";
import Form from "react-bootstrap/Form";
import useForm from "hooks/useForm";
import { Alert, Button } from "react-bootstrap";

interface AccountFormValues {
  name: string;
  email: string;
}

const validate = (values: AccountFormValues) => {
  const errors = {} as { [key: string]: any };
  const { name, email } = values;

  if (name === "") {
    errors.name = `Required`;
  }

  if (email === "") {
    errors.email = `Required`;
  } else if (EmailValidator.validate(email) === false) {
    errors.email = `Must be a valid email address`;
  }

  return errors;
};

interface AccountFormProps {
  defaultValues: AccountFormValues;
  onSubmit: (values: AccountFormValues) => void;
  className?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  defaultValues,
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
  } = useForm(defaultValues, onSubmit, validate);

  return (
    <Form
      className={classnames("form-narrow", className)}
      onSubmit={handleSubmit}
    >
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          isInvalid={visibleErrors.name}
          value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.name && (
          <Form.Control.Feedback>{errors.name}</Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
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
      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
};

export default AccountForm;
