import { useAuth } from "@/context/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Invite.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useCallback, useEffect, useState } from "react"
import { CampaignInviteDetails } from "@/types/api/campaignInvite"

export default function Invite () {
  const { token } = useParams<{ token: string }>()
  const { acceptInvitation } = useAuth()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ invitation, setInvitation ] = useState<CampaignInviteDetails | null>(null)
  const [ error, setError ] = useState<string>("")

  const fetchInvitationDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/campaign-invites/${token}`, 
        { method: "GET" }
      )
      if (response.ok) {
        const invite = await response.json()
        if (invite) setInvitation(invite)
      } else {
        const error = await response.json()
        if (error.message) { 
          setError(error.message)
          throw new Error(error.message)
        } else throw new Error("Failed for unknown reason. Try again later.")
      }
    } catch (error) {
      if (error instanceof Error) 
        console.error("Failed to fetch invitation: ", error.message)
      else console.error("Failed to fetch invitation: ", error)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchInvitationDetails()
  },[token, fetchInvitationDetails])

  const handleAcceptInvite = () => {
    if (!token) return

    if (!user) {
      sessionStorage.setItem("campaignInviteToken", token)
      navigate("/login")
      return
    }
      
    acceptInvitation(token)
  }

  const handleRedirectClick = () => {
    if (user) navigate("/dashboard")
    else navigate("/")
  }

  return (
    <div className={styles.page_container}>
      <div 
        className={`${layoutStyles.non_interactive_card} ${styles.content}`}
      >
        {invitation ? (
          <>
            <p>You've been invited to join</p>
            <h2>{invitation.campaignName}</h2>
            <button
              onClick={handleAcceptInvite}
              className={layoutStyles.green_button}
            >
              {user ? "Accept Invite" : "Login to accept"}
            </button>
          </>
        ) : error ? (
          <>
            <h2>{error}</h2>
            <p>Contact your DM if you need a new invitation.</p>
            <p>If you are having trouble with your invitation, please contact support at <a href="mailto:support@questbase.net">support@questbase.net</a></p>
            <button 
              onClick={handleRedirectClick}
              className={layoutStyles.green_button}
            >
              {user ? "Go to Dashboard" : "Go to Homepage"}
            </button>
          </>
        ) : (
          <>
            <h2>Unexpected Error Occurred</h2>
            <p>If you are looking for a campaign invitation, please have your DM send you a new invitation and use the redirect link in the email</p>
            <p>If you are having trouble with your invitation, please contact support at <a href="mailto:support@questbase.net">support@questbase.net</a></p>
            <button 
              onClick={handleRedirectClick}
              className={layoutStyles.green_button}
            >
              {user ? "Go to Dashboard" : "Go to Homepage"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}