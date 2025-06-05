import UsersProvider, { useUsers } from './context/user-context'
import { UsersPrimaryButtons } from './component/users-primary-button';
import UsersTable from './component/users-table'
import { columns } from './component/users-columns'
import { UsersDialogs } from './component/users-dialogs'
import * as React from 'react'

function UsersContent() {
  const { users, loading } = useUsers();

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Liste des utilisateurs</h2>
          <p className="text-muted-foreground">
            Gérez vos utilisateurs et leurs rôles ici
          </p>
        </div>
        <UsersPrimaryButtons /> 
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <UsersTable columns={columns} data={users} loading={loading} /> 
      </div>
      <UsersDialogs />
    </div>
  );
}

export default function Index() {
  return (
    <UsersProvider>
      <UsersContent />
    </UsersProvider>
  );
}
