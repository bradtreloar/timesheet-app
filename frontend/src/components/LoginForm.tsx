import React from "react";
import * as EmailValidator from "email-validator";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  pending?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, pending, error }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [validated, setValidated] = React.useState(false);

  const validate = () => {
    let isValid = true;
    if (email === "") {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (EmailValidator.validate(email) === false) {
      setEmailError("Email address is not valid.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (password === "") {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  return (
    <form
      className="login-form"
      onSubmit={(event) => {
        if (!pending) {
          event.preventDefault();
          const isValid = validate();
          if (isValid) {
            onSubmit(email, password);
          }
        }
      }}
    >
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          className="form-control"
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
          disabled={pending}
        />
        {emailError && <div className="invalid-feedback">{emailError}</div>}
      </div>
      <div className="form-congrouptrol">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="form-control"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={pending}
        />
        {passwordError && (
          <div className="invalid-feedback">{passwordError}</div>
        )}
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? `Logging in` : `Log in`}
      </button>
    </form>
  );
};

export default LoginForm;
