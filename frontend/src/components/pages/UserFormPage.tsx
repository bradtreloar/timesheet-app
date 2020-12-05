import React, { useMemo } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import useFormController from "hooks/useFormController";
import UserForm, { UserFormValues } from "components/forms/UserForm";
import { Alert } from "react-bootstrap";
import { addUser, selectUsers, updateUser } from "store/users";
import { useHistory, useParams } from "react-router";
import NotFoundPage from "./NotFoundPage";
import { useMessages } from "context/messages";
import store from "store";
import { ShiftTimes, User } from "types";
import { range } from "lodash";

const createEmptyDefaultShifts = (): ShiftTimes[] =>
  range(7).map(() => ({
    isActive: false,
    startTime: {
      hours: "",
      minutes: "",
    },
    endTime: {
      hours: "",
      minutes: "",
    },
    breakDuration: {
      hours: "",
      minutes: "",
    },
  }));

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { users, error: usersStoreError } = useSelector(selectUsers);
  const { setMessage } = useMessages();
  const history = useHistory();

  const newUser = id === undefined;
  const selectedUser = newUser ? null : users.find((user) => user.id === id);

  const { formError, formPending, handleSubmit } = useFormController(
    async (values: UserFormValues) => {
      if (newUser) {
        const newUser: User = {
          ...values,
          defaultShifts: createEmptyDefaultShifts(),
        };
        await store.dispatch(addUser(newUser));
        history.push("/users");
        setMessage("success", `New user ${name} created.`);
      } else {
        const updatedUser = Object.assign({}, selectedUser, values);
        await store.dispatch(updateUser(updatedUser));
        setMessage("success", `User ${name} updated.`);
      }
    }
  );

  if (!newUser && !selectedUser) {
    return <NotFoundPage />;
  }

  return (
    <DefaultLayout>
      <PageTitle>{newUser ? `New User` : `Edit User`}</PageTitle>
      <div className="container">
        {usersStoreError && <Alert variant="danger">{usersStoreError}</Alert>}
        {formError && <Alert variant="danger">{formError}</Alert>}
        <UserForm
          className={classnames(formPending && "is-pending")}
          defaultValues={
            selectedUser
              ? {
                  name: selectedUser.name,
                  email: selectedUser.email,
                  isAdmin: selectedUser.isAdmin,
                }
              : null
          }
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default UserFormPage;
