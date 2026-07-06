import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface User {
  id: number
  displayName: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (
    email: string, 
    password: string, 
    onSuccess?: () => void
  ) => Promise<void>
  logout: (onSuccess?: () => void) => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<User | null>>
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
    onSuccess?: () => void
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        await fetchUser()
        onSuccess?.()
      } else {
        // TODO: show error message
      }
    } catch (error) {
      console.error("Failed to login user: ", error)
    }
  }

  const logout = async (onSuccess?: () => void) => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      if (response.ok) onSuccess?.()
      // handle if not okay
    } catch (error) {
      console.error("Failed to logout user: ", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, setUser }}>
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