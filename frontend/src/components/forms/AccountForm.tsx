import React from "react";
import * as EmailValidator from "email-validator";
import classnames from "classnames";
import Form from "react-bootstrap/Form";
import useForm from "hooks/useForm";
import { Alert, Button } from "react-bootstrap";

export interface AccountFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  acceptsReminders: boolean;
}

const validate = (values: AccountFormValues) => {
  const errors = {} as { [key: string]: any };
  const { name, email, phoneNumber, acceptsReminders } = values;

  if (name === "") {
    errors.name = `Required`;
  }

  if (email === "") {
    errors.email = `Required`;
  } else if (EmailValidator.validate(email) === false) {
    errors.email = `Must be a valid email address`;
  }

  if (phoneNumber === "") {
    errors.phoneNumber = `Required`;
  } else {
    const normalisedPhoneNumber = phoneNumber
      .replace(/-/g, "")
      .replace(/ /g, "");
    if (normalisedPhoneNumber.match(/04[0-9]{8}/) === null) {
      errors.phoneNumber = `Must be a valid Australian mobile number`;
    }
  }

  return errors;
};

interface AccountFormProps {
  defaultValues: AccountFormValues;
  onSubmit: (values: AccountFormValues) => void;
  pending?: boolean;
  className?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  defaultValues,
  onSubmit,
  pending,
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
          disabled={pending}
          type="text"
          name="name"
          isInvalid={visibleErrors.name}
          value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          disabled={pending}
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
      <Form.Group controlId="phoneNumber">
        <Form.Label>Phone number</Form.Label>
        <Form.Control
          disabled={pending}
          type="text"
          name="phoneNumber"
          isInvalid={visibleErrors.phoneNumber}
          value={values.phoneNumber}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.phoneNumber && (
          <Form.Control.Feedback type="invalid">
            {errors.phoneNumber}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="acceptsReminders">
        <Form.Check
          name="acceptsReminders"
          type="checkbox"
          label="Receive SMS reminders"
          isInvalid={visibleErrors.acceptsReminders}
          checked={values.acceptsReminders}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={pending}
        />
        {visibleErrors.acceptsReminders && (
          <Form.Control.Feedback type="invalid">
            {errors.acceptsReminders}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button variant="primary" type="submit" disabled={pending}>
        {pending ? `Saving` : `Save`}
      </Button>
    </Form>
  );
};

export default AccountForm;
