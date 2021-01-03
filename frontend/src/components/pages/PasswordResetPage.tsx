import React from "react";
import PageTitle from "components/PageTitle";
import { useAuth } from "context/auth";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";
import PasswordForm from "components/forms/PasswordForm";
import { useHistory, useParams } from "react-router";
import { useMessages } from "context/messages";
import Messages from "components/Messages";

const PasswordResetPage = () => {
  const { email, token } = useParams<{
    email: string;
    token: string;
  }>();
  const { resetPassword } = useAuth();
  const { setMessage } = useMessages();
  const history = useHistory();

  const { formError, formPending, handleSubmit } = useFormController<{
    password: string;
  }>(async ({ password }) => {
    await resetPassword(email, token, password);
    setMessage("success", `Your password has been set. You can now log in.`, ["account"]);
    history.push(`/login`);
  });

  return (
    <DefaultLayout>
      <PageTitle>Set New Password</PageTitle>
      <Messages />
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <PasswordForm
          onSubmit={handleSubmit}
          pending={formPending}
        />
      </div>
    </DefaultLayout>
  );
};

export default PasswordResetPage;
