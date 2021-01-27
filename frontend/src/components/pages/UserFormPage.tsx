import React from "react";
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
import { ShiftValues, User } from "types";
import { range } from "lodash";
import Messages from "components/Messages";

const createEmptyDefaultShifts = (): ShiftValues[] =>
  range(7).map(() => ({
    isActive: false,
    reason: "rostered-day-off",
    startTime: {
      hour: "",
      minute: "",
    },
    endTime: {
      hour: "",
      minute: "",
    },
    breakDuration: {
      hour: "",
      minute: "",
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
          defaultShiftValues: createEmptyDefaultShifts(),
        };
        await store.dispatch(addUser(newUser));
        setMessage("success", `New user ${newUser.name} created.`);
        history.push("/users");
      } else {
        const updatedUser = Object.assign({}, selectedUser, values);
        await store.dispatch(updateUser(updatedUser));
        setMessage("success", `User ${updatedUser.name} updated.`);
        history.push("/users");
      }
    }
  );

  if (!newUser && !selectedUser) {
    return <NotFoundPage />;
  }

  return (
    <DefaultLayout>
      <PageTitle>{newUser ? `New User` : `Edit User`}</PageTitle>
      <Messages />
      <div className="container">
        {usersStoreError && <Alert variant="danger">{usersStoreError}</Alert>}
        {formError && <Alert variant="danger">{formError}</Alert>}
        <UserForm
          defaultValues={
            selectedUser
              ? {
                  name: selectedUser.name,
                  email: selectedUser.email,
                  phoneNumber: selectedUser.phoneNumber,
                  acceptsReminders: selectedUser.acceptsReminders,
                  isAdmin: selectedUser.isAdmin,
                }
              : null
          }
          onSubmit={handleSubmit}
          pending={formPending}
        />
      </div>
    </DefaultLayout>
  );
};

export default UserFormPage;
