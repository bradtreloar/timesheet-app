import React from "react";
import classnames from "classnames";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import useFormController from "../hooks/useFormController";
import PasswordForm from "../components/PasswordForm";

const PasswordPage = () => {
  const { setPassword } = useAuth();

  const { formError, formSubmitted, handleSubmit } = useFormController<{
    password: string;
  }>(({ password }) => setPassword(password));

  return (
    <DefaultLayout>
      <PageTitle>Set New Password</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <PasswordForm
          className={classnames(formSubmitted && "was-submitted")}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default PasswordPage;
