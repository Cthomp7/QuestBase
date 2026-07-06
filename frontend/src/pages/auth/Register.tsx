import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page.module.css";
import registerImg from "../../assets/imgs/register-img.png";

function Register () {
  const navigate = useNavigate()
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [verifyPassword, setVerifyPassword] = useState<string>("")

  const onRegister = async () => {
    const error = validateForm()
    if (error) {
      console.error(error)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name, email, password })
      })
      if (response.ok) {
        navigate("/dashboard")
      } else {
        // TODO: show error message
      }
    } catch (error) {
      console.error("Failed to Register user: ", error)
    }
  }

  // TODO: add error message system

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
    <main className={`${styles.login_register} ${styles.register}`}>
      <div className={styles.page_container}>
        <div className={`${styles.sub_container} ${styles.login_container}`}>
          <div className={styles.login_portal}>
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
              <input 
                id="password" 
                type="password" 
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <input 
                id="verify-password" 
                type="password" 
                placeholder="verify password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)} 
              />
            </div>
            <button onClick={onRegister}>Register</button>
          </div>
        </div>
        <div className={`${styles.sub_container} ${styles.img_container}`}>
          <img className={styles.login_img} src={registerImg} alt="d7d" />
        </div>
      </div>
    </main>
  )
}

export default Register;