import { orderBy } from "lodash";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../types";

interface UserIndexProps {
  users: User[];
}

interface TableHeadingProps {
  name: keyof User;
  sortOrder?: boolean;
  className?: string;
}

const UserIndex: React.FC<UserIndexProps> = ({ users }) => {
  const [sortOrder, setSortOrder] = useState({
    column: "name" as keyof User,
    ascending: true,
  });

  const sortedUsers = useMemo(
    () =>
      orderBy(
        users,
        [sortOrder.column],
        [sortOrder.ascending ? "asc" : "desc"]
      ),
    [users, sortOrder]
  );

  const handleClickHeading = (column: keyof User) => {
    if (sortOrder.column === column) {
      setSortOrder({
        column,
        ascending: true,
      });
    } else {
      setSortOrder({
        column,
        ascending: !sortOrder.ascending,
      });
    }
  };

  const TableHeading: React.FC<TableHeadingProps> = ({
    name,
    sortOrder,
    className,
    children,
  }) => (
    <th className={className} onClick={() => handleClickHeading(name)}>
      {children}
      {sortOrder !== undefined && (
        <span className="sort-icon">{sortOrder ? `▼` : `▲`}</span>
      )}
    </th>
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <TableHeading name={"name"}>
            <span>Name</span>
          </TableHeading>
          <TableHeading name={"email"}>
            <span>Email</span>
          </TableHeading>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.map((user, index) => {
          const userPageUrl = `/admin/user/${user.id}`;
          return (
            <tr key={index} data-testid="user-index-table-row">
              <td>
                <Link to={userPageUrl}>{user.name}</Link>
              </td>
              <td>
                <Link to={userPageUrl}>{user.email}</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserIndex;
