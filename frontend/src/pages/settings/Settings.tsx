import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { useAuth } from "@/context/AuthContext";
import styles from "./Settings.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader/Loader";
import { CircleAlert, PartyPopper } from "lucide-react";

export default function Settings () {
  const { user } = useAuth()
  const [ displayName, setDisplayName ] = useState<string>("")
  const [ statusMessage, setStatusMessage ] = useState<
  { message: string, type: string} | null>(null)
  const [ submitting, setSubmitting ] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName)
    }
  },[user])

  const saveChanges = async () => {
    if (!displayName) {
      setStatusMessage({
          message: "Your name can not be blank.",
          type: "error"
        })
      console.error("A name is required for accounts.")
      return
    }
    try {
      setSubmitting(true)
      const response = await fetch(`/api/auth/me`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName })
      })
      if (response.ok) {
        setStatusMessage({
          message: "Changes saved!",
          type: "success"
        })
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to save account information changes: ", error)
        setStatusMessage({
          message: error.message,
          type: "error"
        })
      } else {
        console.error("Failed to save account information changes: ", error)
      }
    } finally {
      setSubmitting(false)
    }
  } 

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader 
        title="Settings"
      />
      <h2>Account Information</h2>
      <div className={styles.account_information}>
        <div className={styles.input_fields_container}>
          <div className={styles.input_field}>
            <p className={styles.input_field_key}>Name:</p>
            <input 
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={layoutStyles.dark_input}
            />
          </div>
          <div className={styles.input_field}>
            <p className={styles.input_field_key}>Email Address:</p>
            <input 
              type="text"
              value={user?.email}
              readOnly
              className={layoutStyles.dark_input}
            />
            <p style={{ color: "grey" }}>* Changing account email address is not supported yet</p>
          </div>
        </div>
        <div className={styles.input_buttons}>
          <button 
            className={layoutStyles.periwinkle_button}
            onClick={() => {}}
          >
            Change my password
          </button>
          {submitting ? (
            <Loader/>
          ) : (
            <button 
              className={layoutStyles.green_button}
              onClick={saveChanges}
            >
              Save Changes
            </button>
          )}
        </div>
        {statusMessage && 
            <div className={`${styles.status_message} ${statusMessage.type === "success" ? styles.success : styles.error}`}>
              {statusMessage.type === "success"
                ? <PartyPopper/>
                : <CircleAlert/>}
              <p>{statusMessage.message}</p>
            </div>
          }
      </div>
    </div>
  )
}