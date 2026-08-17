import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { useAuth } from "@/context/AuthContext";
import styles from "./Settings.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader/Loader";
import { CircleAlert, PartyPopper } from "lucide-react";
import PasswordInput from "@/components/PasswordInput/PasswordInput";

export default function Settings () {
  const { user } = useAuth()
  const [ displayName, setDisplayName ] = useState<string>("")
  const [ submitting, setSubmitting ] = useState<string>("")
  const [ accountMessage, setAccountMessage ] = useState<
  { message: string, type: string } | null>(null)
  const [ passwordMessage, setPasswordMessage ] = useState<
  { message: string, type: string } | null>(null)
  const [ currentPassword, setCurrentPassword ] = useState<string>("")
  const [ newPassword, setNewPassword ] = useState<string>("")
  const [ confirmNewPassword, setConfirmNewPassword ] = useState<string>("")

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName)
    }
  },[user])

  const saveChanges = async () => {
    setAccountMessage(null)
    if (!displayName) {
      setAccountMessage({
          message: "Your name can not be blank.",
          type: "error"
        })
      console.error("A name is required for accounts.")
      return
    }
    try {
      setSubmitting("changes")
      const response = await fetch(`/api/auth/me`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName })
      })
      if (response.ok) {
        setAccountMessage({
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
        setAccountMessage({
          message: error.message,
          type: "error"
        })
      } else {
        console.error("Failed to save account information changes: ", error)
      }
    } finally {
      setSubmitting("")
    }
  }

  const savePassword = async () => {
    setPasswordMessage(null)
    try {
      setSubmitting("password")
      validatePasswords()

      const response = await fetch(`/api/auth/password`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (response.ok) {
        setPasswordMessage({
          message: "Password saved!",
          type: "success"
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to save new password: ", error)
        setPasswordMessage({
          message: error.message,
          type: "error"
        })
      } else {
        console.error("Failed to to save new password: ", error)
      }
    } finally {
      setSubmitting("")
    }
  }

  const validatePasswords = () => {
    if (!currentPassword) {
      throw new Error("Enter your current password.")
    } else if (!newPassword) {
      throw new Error("Enter a new password.")
    } else if (newPassword !== confirmNewPassword) {
      throw new Error("New passwords do not match.")
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
          {submitting === "changes" ? (
            <Loader/>
          ) : (
            <button 
              className={layoutStyles.periwinkle_button}
              onClick={saveChanges}
            >
              Save Changes
            </button>
          )}
          {accountMessage && 
            <div className={`${styles.status_message} ${accountMessage.type === "success" ? styles.success : styles.error}`}>
              {accountMessage.type === "success"
                ? <PartyPopper size={20}/>
                : <CircleAlert/>}
              <p>{accountMessage.message}</p>
            </div>
          }
        </div>
        <hr/>
        <h2>Password</h2>
        <div className={styles.input_fields_container}>
          <div className={styles.input_field}>
            <p className={styles.input_field_key}>Current Password:</p>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              placeholder="current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              color="dark"
            />
          </div>
          <div></div>
          <div className={styles.input_field}>
            <p className={styles.input_field_key}>New Password:</p>
            <PasswordInput 
              id="newPassword"
              name="newPassword"
              placeholder="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              color="dark"
            />
          </div>
          <div className={styles.input_field}>
            <p className={styles.input_field_key}>Confirm New Password:</p>
            <PasswordInput 
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              color="dark"
            />
          </div>
        </div>
        <div className={styles.input_buttons}>
          {submitting === "password" ? (
            <Loader/>
          ) : (
            <button 
              className={layoutStyles.periwinkle_button}
              onClick={savePassword}
            >
              Save Password
            </button>
          )}
          {passwordMessage && 
            <div className={`${styles.status_message} ${passwordMessage.type === "success" ? styles.success : styles.error}`}>
              {passwordMessage.type === "success"
                ? <PartyPopper size={20}/>
                : <CircleAlert/>}
              <p>{passwordMessage.message}</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}