import React from "react";
import classnames from "classnames";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/auth";
import DefaultLayout from "../layouts/DefaultLayout";
import useFormController from "../hooks/useFormController";
import PasswordResetForm from "../components/forms/PasswordResetForm";
import { useHistory } from "react-router";

const PasswordResetPage = () => {
  const { resetPassword } = useAuth();
  const history = useHistory();

  const { formError, formPending, handleSubmit } = useFormController<{
    email: string;
  }>(async ({ email }) => {
    await resetPassword(email);
    history.push("/");
  });

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
