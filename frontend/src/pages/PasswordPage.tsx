import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import { useFormController } from "../form/formController";
import PasswordForm from "../components/PasswordForm";

const PasswordPage = () => {
  const { setPassword } = useAuth();

  const { formError, formSubmitted, handleSubmit } = useFormController<{
    password: string;
  }>(async ({ password }) => await setPassword(password));

  return (
    <DefaultLayout>
      <PageTitle>Set New Password</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <PasswordForm
          className={classnames(formSubmitted && "was-submitted")}
          onSubmit={handleSubmit}
        ></PasswordForm>
      </div>
    </DefaultLayout>
  );
};

export default PasswordPage;
