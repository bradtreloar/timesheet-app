import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import { useFormController } from "../form/formController";
import PasswordResetForm from "../components/PasswordResetForm";

const PasswordResetPage = () => {
  const { resetPassword } = useAuth();

  const { formError, formSubmitted, handleSubmit } = useFormController<{
    email: string;
  }>(async ({ email }) => await resetPassword(email));

  return (
    <DefaultLayout>
      <PageTitle>Reset Password</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <PasswordResetForm
          className={classnames(formSubmitted && "was-submitted")}
          onSubmit={handleSubmit}
        ></PasswordResetForm>
      </div>
    </DefaultLayout>
  );
};

export default PasswordResetPage;
