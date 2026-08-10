import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Auth.module.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import Loader from "@/components/ui/Loader/Loader";

interface RegisterProps {
  turnstileToken: string
  setTurnstileToken: (value: string) => void
  onError: (error: string) => void
} 

export default function Register ({ 
  turnstileToken, 
  setTurnstileToken, 
  onError 
} : RegisterProps) {
  const navigate = useNavigate()
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [verifyPassword, setVerifyPassword] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)

  const onRegister = async () => {
    const error = validateForm()
    if (error) {
      console.error(error)
      return
    }

    if (!turnstileToken) {
      onError("Please complete the security check.")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name, email, password, turnstileToken })
      })
      if (response.ok) {
        navigate("/dashboard")
      } else {
        const error = await response.json();
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Failed to register user: ", error)
      if (error instanceof Error) {
        onError(error.message)
      } else {
        onError("An unexpected error occurred. Please try again later.")
      }
    } finally {
      setSubmitting(false)
      setTurnstileToken("")
      window.turnstile?.reset()
    }
  }

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!name.trim()) return "Please enter a name."
    if (!email.trim()) return "Please enter a email address."
    if (!emailRegex.test(email)) return "Please enter a valid email address."
    if (!password) return "Please enter a password."
    if (password !== verifyPassword) return "Passwords do not match."
    return null;
  }

  return (
    <>
      <div className={styles.login_portal_title}>
        <h2>Welcome to</h2>
        <h1>QuestBase!</h1>
        <p>Your Campaign. Your Story. Your Quest.</p>
      </div>
      <div className={styles.login_portal_inputs}>
        <input 
          id="name" 
          type="text" 
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <PasswordInput 
          id="verify-password" 
          name="verify-password" 
          placeholder="verify password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)} 
        />
        <div
          className="cf-turnstile"
          data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          data-callback="onTurnstileSuccess"
          data-expired-callback="onTurnstileExpired"
          style={{ marginTop: "10px"}}
        ></div>
        {submitting
          ? <Loader/>
          : <button onClick={onRegister}>Register</button>}
      </div>
    </>
  )
}