import useDialogState from '@/hooks/use-dialig-state';
import * as React from 'react';

const UsersContext = React.createContext();

export default function UsersProvider({ children }) {
  const [open , setOpen] = useDialogState(null); 
  const [currentRow, setCurrentRow] = React.useState(null)

  return (
    <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const context = React.useContext(UsersContext)

  if (!context) {
    throw new Error('useUsers doit être utilisé dans un <UsersProvider>')
  }

  return context
}