import { User } from "@/types/api/user"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (
    email: string, 
    password: string, 
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => Promise<void>
  logout: (onSuccess?: () => void) => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  fetchUser: () => Promise<void>
  acceptInvitation: (
    token: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }

  const login = async (
    email: string, 
    password: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        await fetchUser()
        const inviteToken = sessionStorage.getItem("campaignInviteToken");
        if (inviteToken) acceptInvitation(inviteToken, onSuccess, onError)
        else onSuccess?.()
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Failed to login user: ", error)
      if (error instanceof Error) {
        onError?.(error.message)
      } else {
        onError?.("An unexpected error occurred. Please try again later.")
      }
    }
  }

  const logout = async (onSuccess?: () => void) => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      if (response.ok) {
        const inviteToken = sessionStorage.getItem("campaignInviteToken");
        if (inviteToken) acceptInvitation(inviteToken, onSuccess)
        else onSuccess?.()
      }
      // TODO: handle if not okay
    } catch (error) {
      console.error("Failed to logout user: ", error)
    }
  }

  const acceptInvitation = async (
    token: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      const response = await fetch(
        `/api/campaign-invites/${token}/accept`,
        { method: "POST" }
      )
      if (response.ok) {
        console.log("Invitation accepted");
        sessionStorage.removeItem("campaignInviteToken");
        console.log("Calling onSuccess", onSuccess);
        onSuccess?.()
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }
    } catch (error) {
      if (error instanceof Error) 
        onError?.(error.message)
      else onError?.(`Failed to accept invitation: ${error}`)
    }
  } 

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      logout, 
      setUser,
      fetchUser,
      acceptInvitation }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}