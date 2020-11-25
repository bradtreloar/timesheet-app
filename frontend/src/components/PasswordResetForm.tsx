import React, { useMemo, useState } from "react";
import passwordStrength from "owasp-password-strength-test";
import Form from "react-bootstrap/Form";
import { useForm } from "../form/form";
import { Button } from "react-bootstrap";
// import "./PasswordResetForm.scss";

interface PasswordResetFormProps {
  onSubmit: (password: string) => void;
  pending?: boolean;
}

interface PasswordResetFormValues {
  password: string;
  password2: string;
}

const initialValues: PasswordResetFormValues = {
  password: "",
  password2: "",
};

const validate = (values: PasswordResetFormValues) => {
  const errors = {} as { [key: string]: any };
  const { password, password2 } = values;

  if (password === "") {
    errors.password = `Required`;
  } else {
    const strengthResult = passwordStrength.test(password);
    if (strengthResult.requiredTestErrors.length > 0) {
      errors.password = `Password must be stronger`;
    }
  }

  if (password2 === "") {
    errors.password2 = `Required`;
  } else {
    if (password !== "" && password !== password) {
      errors.password2 = `Passwords must match`;
    }
  }

  return errors;
};

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  pending,
}) => {
  const { values, errors, handleSubmit, handleChange, handleBlur } = useForm(
    initialValues,
    (values) => {
      onSubmit(values.password);
    },
    validate
  );

  const requiredTestErrors = useMemo(() => {
    return passwordStrength.test(values.password).requiredTestErrors;
  }, [values.password]);

  return (
    <Form className="form-narrow" onSubmit={handleSubmit}>
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      <Form.Group controlId="password">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {requiredTestErrors.length > 0 && (
          <div>
            <ul>
              {requiredTestErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {errors.password && (
          <Form.Control.Feedback>{errors.password}</Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="password2">
        <Form.Label>Re-enter new Password</Form.Label>
        <Form.Control
          type="password"
          name="password2"
          value={values.password2}
          onChange={handleChange}
        />
        {errors.password2 && (
          <Form.Control.Feedback>{errors.password2}</Form.Control.Feedback>
        )}
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        data-testid="password-reset-form-submit"
        disabled={pending}
      >
        {pending ? `Saving` : `Save password`}
      </Button>
    </Form>
  );
};

export default PasswordResetForm;
