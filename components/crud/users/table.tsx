'use client';

import React, { useState, useTransition } from 'react';

import { updateUserRole } from '@/lib/actions/admin/users';

import { Switch } from '@nextui-org/react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Role, User } from '@prisma/client';

type UserWithRoles = User & {
  userRoles: {
    role: Role;
  }[];
};

// wytlumaczenie z chatu jakby ktos byl ciekawy
export default function UsersTable({ users }: { users: UserWithRoles[] }) {
  const [userList, setUserList] = useState(users);
  const [isPending, startTransition] = useTransition();

  const handleRoleToggle = (
    userId: string,
    roleName: string,
    isSelected: boolean
  ) => {
    // Save the previous state
    const previousUserList = [...userList];

    // Optimistically update the userList state
    setUserList((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const hasRole = user.userRoles.some(
            (ur) => ur.role.name === roleName
          );
          if (isSelected && !hasRole) {
            // Add role
            return {
              ...user,
              userRoles: [
                ...user.userRoles,
                { role: { id: '', name: roleName } },
              ],
            };
          } else if (!isSelected && hasRole) {
            // Remove role
            return {
              ...user,
              userRoles: user.userRoles.filter(
                (ur) => ur.role.name !== roleName
              ),
            };
          }
        }
        return user;
      })
    );

    // Call the server action
    startTransition(() => {
      updateUserRole(userId, roleName, isSelected).catch((error) => {
        // Revert to previous state on error
        setUserList(previousUserList);
        console.error(error);
      });
    });
  };

  return (
    <div className="my-6">
      <Table isStriped aria-label="User roles table">
        <TableHeader>
          <TableColumn>Uzytkownik</TableColumn>
          <TableColumn>Przodownik</TableColumn>
          <TableColumn>Referat</TableColumn>
        </TableHeader>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Switch
                  color="success"
                  isSelected={user.userRoles.some(
                    (ur) => ur.role.name === 'PRZODOWNIK'
                  )}
                  onChange={(e) =>
                    handleRoleToggle(user.id, 'PRZODOWNIK', e.target.checked)
                  }
                />
              </TableCell>
              <TableCell>
                <Switch
                  color="success"
                  isSelected={user.userRoles.some(
                    (ur) => ur.role.name === 'REFERAT'
                  )}
                  onChange={(e) =>
                    handleRoleToggle(user.id, 'REFERAT', e.target.checked)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
