import usePagination from "hooks/usePagination";
import { orderBy } from "lodash";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface UserTableProps {
  users: User[];
}

interface TableHeadingProps {
  name: keyof User;
  className?: string;
}

interface SortOrder {
  column: keyof User;
  ascending: boolean;
}

const defaultSortOrder: SortOrder = {
  column: "name" as keyof User,
  ascending: true,
};

const sortedItems = function <T>(items: T[], sortOrder: SortOrder) {
  return orderBy(
    items,
    [sortOrder.column],
    [sortOrder.ascending ? "asc" : "desc"]
  );
};

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const sortedUsers = useMemo(() => sortedItems(users, sortOrder), [
    users,
    sortOrder,
  ]);
  const { items, Pager } = usePagination(sortedUsers);

  const handleClickHeading = (column: keyof User) => {
    if (sortOrder.column === column) {
      setSortOrder({
        column,
        ascending: !sortOrder.ascending,
      });
    } else {
      setSortOrder({
        column,
        ascending: true,
      });
    }
  };

  const TableHeading: React.FC<TableHeadingProps> = ({
    name,
    className,
    children,
  }) => (
    <th className={className} onClick={() => handleClickHeading(name)}>
      {children}
      {sortOrder.column === name && (
        <span className="sort-icon ml-2">
          {sortOrder.ascending ? `▲` : `▼`}
        </span>
      )}
    </th>
  );

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <TableHeading name="name">
              <span>Name</span>
            </TableHeading>
            <TableHeading name="isAdmin">
              <span>Account type</span>
            </TableHeading>
            <TableHeading name="email" className="text-right">
              <span>Email</span>
            </TableHeading>
          </tr>
        </thead>
        <tbody>
          {items.map((user, index) => {
            const userPageUrl = `/users/${user.id}`;
            return (
              <tr key={index} data-testid="user-index-table-row">
                <td>
                  <Link to={userPageUrl}>{user.name}</Link>
                </td>
                <td>
                  {user.isAdmin ? `Administrator` : `Employee`}
                </td>
                <td className="text-right">
                  <Link to={userPageUrl}>{user.email}</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <Pager />
      </div>
    </>
  );
};

export default UserTable;
