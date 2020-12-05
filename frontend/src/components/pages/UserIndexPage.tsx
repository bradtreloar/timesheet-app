import React from "react";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import { useAuth } from "context/auth";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserTable from "components/tables/UserTable";
import { useSelector } from "react-redux";
import { selectUsers } from "store/users";

const UserIndexPage = () => {
  const { user, logout } = useAuth();
  const { users, status: userStoreStatus } = useSelector(
    selectUsers
  );

  return (
    <DefaultLayout>
      <PageTitle>Manage Users</PageTitle>
      <div className="container">
        <div className="my-3">
          <Link className="btn btn-primary" to="/new-user">
            Create new user
          </Link>
        </div>
        {userStoreStatus === "pending" ? (
          <p>Loading...</p>
        ) : (
          <UserTable users={users} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default UserIndexPage;
