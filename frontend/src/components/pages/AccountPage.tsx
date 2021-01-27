import React from "react";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";
import { Alert } from "react-bootstrap";
import { updateUser } from "store/users";
import NotFoundPage from "./NotFoundPage";
import { useMessages } from "context/messages";
import store from "store";
import { useAuth } from "context/auth";
import AccountForm, { AccountFormValues } from "components/forms/AccountForm";
import { Link } from "react-router-dom";
import Messages from "components/Messages";

const AccountPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { setMessage } = useMessages();

  const { formError, formPending, handleSubmit } = useFormController(
    async (values: AccountFormValues) => {
      const updatedUser = Object.assign({}, user, values);
      const action = await store.dispatch(updateUser(updatedUser));
      if (action.type === "users/update/fulfilled") {
        setMessage("success", `Account settings updated.`, ["account"]);
        await refreshUser();
      }
    }
  );

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <DefaultLayout>
      <PageTitle>Account Settings</PageTitle>
      <Messages />
      <div className="container">
        {formError && <Alert variant="danger">{formError}</Alert>}
        <AccountForm
          defaultValues={{
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            acceptsReminders: user.acceptsReminders,
          }}
          onSubmit={handleSubmit}
          pending={formPending}
        />
        <div className="my-3">
          <Link to="/account/password">Change password</Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AccountPage;
