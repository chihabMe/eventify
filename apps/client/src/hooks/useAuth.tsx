import { authContext } from "@/context/AuthContext";
import { useContext } from "react";



export const useAuth = () => {

  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context
}

