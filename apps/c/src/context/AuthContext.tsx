import { IUser } from "@/interfaces";
import { authQueryKeys, useLogoutMutation, useProfileQuery } from "@/services/auth/auth.queries";
import { queryManager } from "@/services/query.manager";
import { createContext, ReactNode } from "react";

interface AuthContextInterface {
  user: IUser | null,
  logout: () => void,
  isLoading: boolean,
  isError: boolean,
  refresh: () => void,
  isUser: () => boolean,
  isOrganizer: () => boolean,
  isAdmin: () => boolean,
}

const initialState: AuthContextInterface = {
  user: null,
  isLoading: true,
  isError: false,
  logout: () => { },
  refresh: () => { },
  isUser: () => false,
  isOrganizer: () => false,
  isAdmin: () => false,
}

export const authContext = createContext<AuthContextInterface>(initialState)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, data: user, isError } = useProfileQuery()
  const { mutate: logout } = useLogoutMutation()

  const refresh = () => {
    queryManager.invalidate(authQueryKeys.profile)
  }

  const isUser = () => {
    return user && user.role == "USER"
  }

  const isAdmin = () => {
    return user && user.role == "ADMIN"
  }

  const isOrganizer = () => {
    return user && user.role == "ORGANIZER"
  }

  const value: AuthContextInterface = {
    isLoading, // Pass the raw isLoading value
    isError,   // Add isError to the context
    user,
    refresh,
    logout,
    isAdmin,
    isOrganizer,
    isUser
  }

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  )
}
