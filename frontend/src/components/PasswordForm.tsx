import React, { useMemo } from "react";
import classnames from "classnames";
import passwordStrength from "owasp-password-strength-test";
import Form from "react-bootstrap/Form";
import { useForm } from "../form/form";
import { Alert, Button } from "react-bootstrap";

interface PasswordFormValues {
  password: string;
  password2: string;
}

const initialValues: PasswordFormValues = {
  password: "",
  password2: "",
};

const validate = (values: PasswordFormValues) => {
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
    if (password !== "" && password2 !== password) {
      errors.password2 = `Passwords must match`;
    }
  }

  return errors;
};

interface PasswordFormProps {
  onSubmit: (values: PasswordFormValues) => void;
  className?: string;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ onSubmit, className }) => {
  const {
    values,
    errors,
    visibleErrors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useForm(initialValues, onSubmit, validate);

  const requiredTestErrors = useMemo(() => {
    return passwordStrength.test(values.password).requiredTestErrors;
  }, [values.password]);

  return (
    <Form
      className={classnames("form-narrow", className)}
      onSubmit={handleSubmit}
    >
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Form.Group controlId="password">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          isInvalid={visibleErrors.password || requiredTestErrors.length > 0}
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {(visibleErrors.password || requiredTestErrors.length > 0) && (
          <Form.Control.Feedback>{errors.password}</Form.Control.Feedback>
        )}
        {requiredTestErrors.length > 0 && (
          <Form.Control.Feedback>
            <ul>
              {requiredTestErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="password2">
        <Form.Label>Re-enter new Password</Form.Label>
        <Form.Control
          type="password"
          name="password2"
          isInvalid={visibleErrors.password2}
          value={values.password2}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {visibleErrors.password2 && (
          <Form.Control.Feedback>{errors.password2}</Form.Control.Feedback>
        )}
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        data-testid="password-form-submit"
      >
        Save password
      </Button>
    </Form>
  );
};

export default PasswordForm;
