import React from "react";
import classnames from "classnames";
import PageTitle from "components/PageTitle";
import { useAuth } from "context/auth";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";
import PasswordForm from "components/forms/PasswordForm";
import { useHistory } from "react-router";

const PasswordPage = () => {
  const { setPassword } = useAuth();
  const history = useHistory();

  const { formError, formPending, handleSubmit } = useFormController<{
    password: string;
  }>(async ({ password }) => {
    await setPassword(password);
    history.push(`/account`);
  });

  return (
    <DefaultLayout>
      <PageTitle>Set New Password</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <PasswordForm
          className={classnames(formPending && "is-pending")}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default PasswordPage;
