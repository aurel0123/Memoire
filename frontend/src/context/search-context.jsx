import { createContext, useState , useEffect, useContext } from "react"
import CommandMenu from '@/components/command-menu'
const SearchContext = createContext()

export function SearchProvider({children}){
  const [open , setOpen] = useState(false)

  useEffect(()=>{
    const down = (e) =>{
      if(e.key === 'k' && (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        setOpen((open) => !open)
      }

    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])


    return(
      <SearchContext.Provider value={{open, setOpen}}>
        {children}
        <CommandMenu />
      </SearchContext.Provider>
    )
} 

export const useSearch = () => {
  const searchContext = useContext(SearchContext)
  if(!searchContext){
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return searchContext 
}