import UsersProvider from './context/user-context'
import { UsersPrimaryButtons } from './component/users-primary-button';
import UsersTable from './component/users-table'
import { columns } from './component/users-columns'
import * as React from 'react'
import { services } from '@/services/services';

export default function Index() {
  const [userList, setUserList] = React.useState([])

  const fetchUsers = async () => {
    try{
      const response = await services.get('/utilisateurs/') ; 
      setUserList(response) ;

    }catch(error){
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  }
  React.useEffect(() => {
    fetchUsers() ; 
  }, [])
  
  return (
    <UsersProvider>
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
          <UsersTable columns={columns} data={userList} /> 
        </div>
      </div>
    </UsersProvider>
  );
}
