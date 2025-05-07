import { useAuth } from "@/hooks/useAuth";
import { IUserRole } from "@/interfaces";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowdRoles }: { children: ReactNode, allowdRoles: IUserRole[] }) => {
  const { isLoading, user } = useAuth()
  if (isLoading) {
    return <div>loading</div>
  }
  if (!user) {
    <Navigate to={"/login"} />

  }

  if (!allowdRoles.includes(user.role)) {
    return <Navigate to="/forbidden" />
  }
  console.log(user.role)
  return children
}
