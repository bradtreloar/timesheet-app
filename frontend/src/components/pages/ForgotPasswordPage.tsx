import React from "react";
import classnames from "classnames";
import PageTitle from "components/PageTitle";
import { useAuth } from "context/auth";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";
import ForgotPasswordForm from "components/forms/ForgotPasswordForm";
import { useHistory } from "react-router";

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const history = useHistory();

  const { formError, formPending, handleSubmit } = useFormController<{
    email: string;
  }>(async ({ email }) => {
    await forgotPassword(email);
    history.push("/");
  });

  return (
    <DefaultLayout>
      <PageTitle>Reset Password</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <ForgotPasswordForm
          className={classnames(formPending && "is-pending")}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default ForgotPasswordPage;
