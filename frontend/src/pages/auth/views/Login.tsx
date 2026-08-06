import PasswordInput from "@/components/PasswordInput/PasswordInput"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../Auth.module.css";
import Loader from "@/components/ui/loader/Loader";

interface LoginProps {
  onError: (error: string) => void
} 

export default function Login ({ onError }: LoginProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)

  const onLogin = async () => {
    onError("")
    if (!email) {
      onError("Please enter a valid email address.")
      console.error("Please enter a valid email address.")
      return
    }

    if (!password) {
      onError("Please enter a valid password.")
      console.error("Please enter a valid password.")
      return
    }

    try {
      setSubmitting(true)
      await login(email, password, 
        () => { navigate("/dashboard") },
        (error) => { onError(error) }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.login_portal_title}>
        <h1>Welcome Back!</h1>
        <p>Your Campaign. Your Story. Your Quest.</p>
      </div>
      <div className={styles.login_portal_inputs}>
        <input 
          id="email" 
          type="text" 
          placeholder="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput 
          id="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <a href="/forgot-password">Forgot Password?</a>
        {submitting
          ? <Loader />
          : <button onClick={onLogin}>Login</button>
        }
        <p>New to QuestBase? <a href="/register">Create account</a></p>
      </div>
    </>
  )
}