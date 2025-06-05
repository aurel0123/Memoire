import { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '@/services/user-service'
import { toast } from 'sonner'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)
  const [currentRow, setCurrentRow] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId) => {
    try {
      await userService.approveUser(userId)
      toast.success('Utilisateur approuvé avec succès')
      fetchUsers() // Rafraîchir la liste
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'approbation de l\'utilisateur')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const value = {
    users,
    loading,
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    fetchUsers,
    handleApproveUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUsers() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsers doit être utilisé à l\'intérieur d\'un UserProvider')
  }
  return context
}

// Export par défaut
export default UserProvider