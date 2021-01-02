import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import LoginForm from "components/forms/LoginForm";
import Messages from "components/Messages";
import PageTitle from "components/PageTitle";
import { useAuth } from "context/auth";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";

const LoginPage = () => {
  const { login } = useAuth();

  const { formError, formPending, handleSubmit } = useFormController<{
    email: string;
    password: string;
  }>(({ email, password }) => login(email, password));

  return (
    <DefaultLayout>
      <PageTitle>Log in</PageTitle>
      <Messages />
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <LoginForm
          className={classnames(formPending && "is-pending")}
          onSubmit={handleSubmit}
          pending={formPending}
        />
        <div className="my-3">
          <Link to="forgot-password">
            Forgot your password? Click here to reset it.
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
