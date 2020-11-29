import React from "react";
import classnames from "classnames";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import useFormController from "../hooks/useFormController";
import PasswordResetForm from "../components/PasswordResetForm";

const PasswordResetPage = () => {
  const { resetPassword } = useAuth();

  const { formError, formPending, handleSubmit } = useFormController<{
    email: string;
  }>(({ email }) => resetPassword(email));

  return (
    <DefaultLayout>
      <PageTitle>Reset Password</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <PasswordResetForm
          className={classnames(formPending && "is-pending")}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default PasswordResetPage;
