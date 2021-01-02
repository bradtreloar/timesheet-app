import React from "react";
import classnames from "classnames";
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

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { setMessage } = useMessages();

  const { formError, formPending, handleSubmit } = useFormController(
    async (values: AccountFormValues) => {
      const updatedUser = Object.assign({}, user, values);
      await store.dispatch(updateUser(updatedUser));
      setMessage("success", `Account settings updated.`);
    }
  );

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <DefaultLayout>
      <PageTitle>Account Settings</PageTitle>
      <div className="container">
        {formError && <Alert variant="danger">{formError}</Alert>}
        <AccountForm
          className={classnames(formPending && "is-pending")}
          defaultValues={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        />
        <div className="my-3">
          <Link to="/account/password">Change password</Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AccountPage;
