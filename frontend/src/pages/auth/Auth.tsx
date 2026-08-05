import { useEffect, useState } from "react"
import styles from "./Auth.module.css"
import img from "../../assets/imgs/QB_Lost_Cabin.png"
import { CircleX } from "lucide-react"
import Login from "./views/Login"
import Register from "./views/Register"

interface AuthProps {
  view: string
} 

export default function Auth ({ view }: AuthProps) {
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [turnstileToken, setTurnstileToken] = useState<string>("")

  useEffect(() => {
      window.onTurnstileSuccess = (token: string) => {
        setTurnstileToken(token)
      }
      window.onTurnstileExpired = () => {
        setTurnstileToken("")
      }
      return () => {
        delete window.onTurnstileSuccess
        delete window.onTurnstileExpired
      }
    }, [])

  return (
    <main className={`${styles.login_register} ${styles.login}`}>
      <div className={styles.page_container}>
        <div className={`${styles.sub_container} ${styles.login_container}`}>
          <div className={styles.login_portal}>
            {view === "login" 
              ? 
                <Login 
                  onError={(error) => setErrorMessage(error)}
                />
              : 
                <Register 
                  turnstileToken={turnstileToken}
                  setTurnstileToken={(value: string) => setTurnstileToken(value)}
                  onError={(error) => setErrorMessage(error)}
                />
            }
            {errorMessage && 
              <div className={`${styles.message} ${styles.error_message}`}>
                <CircleX color={"#ff5d5d"} size={25}/>
                <p>{errorMessage}</p>
              </div>
            }
          </div>
          {/* TODO: fix placement 
          <div className={`${styles.message} ${styles.notification_message}`}>
            <CircleAlert color={"#adff5d"} size={25}/>
            <p>QuestBase is in very early development.</p>
          </div> */}
        </div>
        <div className={`${styles.sub_container} ${styles.img_container}`}>
          <img className={styles.login_img} src={img} alt="d7d" />
        </div>
      </div>
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </main>
  )
}