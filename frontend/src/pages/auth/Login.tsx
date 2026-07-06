import { useState } from "react";
import styles from "./page.module.css";
import img from "../../assets/imgs/login-img.png";
import { useNavigate } from "react-router-dom";

function Login () {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const onLogin = async () => {
    if (!email) {
      console.error("Please enter a valid email address")
      return
    }

    if (!password) {
      console.error("Please enter a valid password")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        navigate("/dashboard")
      } else {
        // TODO: show error message
      }
    } catch (error) {
      console.error("Failed to login user: ", error)
    }
  }

  // TODO: add error message system

  return (
    <main className={`${styles.login_register} ${styles.login}`}>
      <div className={styles.page_container}>
        <div className={`${styles.sub_container} ${styles.login_container}`}>
          <div className={styles.login_portal}>
            <div className={styles.login_portal_title}>
              <h1>Welcome back!</h1>
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
              <input 
                id="password" 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <a href="/forgot-password">Forgot Password?</a>
              <button onClick={onLogin}>Login</button>
              <p>New to QuestBase? <a href="/register">Create account</a></p>
            </div>
          </div>
        </div>
        <div className={`${styles.sub_container} ${styles.img_container}`}>
          <img className={styles.login_img} src={img} alt="d7d" />
        </div>
      </div>
    </main>
  )
}

export default Login;