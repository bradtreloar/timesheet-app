import React from "react";
import PageTitle from "components/PageTitle";
import { Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteUser, selectUsers } from "store/users";
import DefaultLayout from "components/layouts/DefaultLayout";
import NotFoundPage from "./NotFoundPage";
import store from "store";
import { useMessages } from "context/messages";
import Messages from "components/Messages";

const UserDeletePage = () => {
  const { id } = useParams<{ id?: string }>();
  const { users } = useSelector(selectUsers);
  const history = useHistory();
  const { setMessage } = useMessages();

  const user = users.find((user) => user.id === id);

  if (user === undefined) {
    return <NotFoundPage />;
  }

  const handleDeleteUser = async () => {
    await store.dispatch(deleteUser(user));
    setMessage("success", `User ${user?.name} deleted`);
    history.push("/users");
  };

  const handleCancel = async () => {
    history.push("/users");
  };

  return (
    <DefaultLayout>
      <PageTitle>Delete User</PageTitle>
      <Messages />
      <div className="container">
        <p>{`Delete ${user.name}?`}</p>
        <div>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
          <Button variant="outline-secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserDeletePage;
