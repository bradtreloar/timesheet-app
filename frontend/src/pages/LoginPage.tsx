import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import useFormController from "../hooks/useFormController";

const LoginPage = () => {
  const { login } = useAuth();

  const { formError, formPending, handleSubmit } = useFormController<{
    email: string;
    password: string;
  }>(({ email, password }) => login(email, password));

  return (
    <DefaultLayout>
      <PageTitle>Log in</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <LoginForm
          className={classnames(formPending && "is-pending")}
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
