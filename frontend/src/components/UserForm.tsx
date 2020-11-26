import React, { useMemo } from "react";
import * as EmailValidator from "email-validator";
import Form from "react-bootstrap/Form";
import { useForm } from "../form/form";
import { Alert, Button } from "react-bootstrap";
import { User } from "../types";

interface UserFormValues {
  name: string;
  email: string;
}

const validate = (values: UserFormValues) => {
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

interface UserFormProps {
  defaultValues?: {
    name: string;
    email: string;
  };
  onSubmit: (name: string, email: string) => void;
  pending?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  pending,
}) => {
  const {
    values,
    errors,
    visibleErrors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useForm(
    defaultValues ? defaultValues : { name: "", email: "" },
    (values) => onSubmit(values.name, values.email),
    validate
  );
  const isNewUser = defaultValues === undefined;

  return (
    <Form className="form-narrow" onSubmit={handleSubmit}>
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
      <Button variant="primary" type="submit" disabled={pending}>
        {isNewUser 
          ? (pending ? `Saving` : `Create user`)
          : (pending ? `Saving` : `Save`)
        }
      </Button>
    </Form>
  );
};

export default UserForm;
