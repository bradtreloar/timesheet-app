import React from "react";
import classnames from "classnames";
import PageTitle from "components/PageTitle";
import { useAuth } from "context/auth";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";
import PasswordForm from "components/forms/PasswordForm";
import { useHistory } from "react-router";
import { useMessages } from "context/messages";
import Messages from "components/Messages";

const PasswordPage = () => {
  const { setPassword } = useAuth();
  const { setMessage } = useMessages();
  const history = useHistory();

  const { formError, formPending, handleSubmit } = useFormController<{
    password: string;
  }>(async ({ password }) => {
    await setPassword(password);
    setMessage("success", `Password changed.`, ["account"]);
    history.push(`/account`);
  });

  return (
    <DefaultLayout>
      <PageTitle>Set New Password</PageTitle>
      <Messages />
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
