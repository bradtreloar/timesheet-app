import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import useFormController from "../hooks/useFormController";

const LoginPage = () => {
  const { login } = useAuth();

  const { formError, formSubmitted, handleSubmit } = useFormController<{
    email: string;
    password: string;
  }>(async ({ email, password }) => {
    await login(email, password);
  });

  return (
    <DefaultLayout>
      <PageTitle>Log in</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <LoginForm
          className={classnames(formSubmitted && "was-submitted")}
          onSubmit={handleSubmit}
        />
        <div>
          <Link to="reset-password">
            Forgot your password? Click here to reset it.
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
