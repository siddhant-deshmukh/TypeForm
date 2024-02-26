import { IFormSnippet, IUser } from "./types";
import React, { useEffect, useState } from "react";

export const AppContext = React.createContext<{
  user: IUser | null,
  authLoading: boolean,
  userForms: IFormSnippet[]
  modals: "new-form" | null
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setAuthLoading: (value: React.SetStateAction<boolean>) => void
  setuserForms: React.Dispatch<React.SetStateAction<IFormSnippet[]>>
  setModals: React.Dispatch<React.SetStateAction<"new-form" | null>>
}>({
  user: null,
  modals: null,
  userForms: [],
  authLoading: true,
  setUser: () => { },
  setModals: () => { },
  setuserForms: () => { },
  setAuthLoading: () => { },
})


export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser | null>(null)
  const [userForms, setuserForms] = useState<IFormSnippet[]>([])
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [modals, setModals] = useState<null | 'new-form'>(null)

  useEffect(() => {
    setAuthLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user && data.user._id) {
          setUser(data.user)
          console.log('got the data user', data.user)
        } else {
          setUser(null)
        }
      }).catch(() => {
        console.error("Error while fetching the user data")
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [])

  return (
    <AppContext.Provider value={{
      user, setUser,
      modals, setModals,
      userForms, setuserForms,
      authLoading, setAuthLoading,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext