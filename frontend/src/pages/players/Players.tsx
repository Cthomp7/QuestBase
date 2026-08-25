import CreateButton from "@/components/ui/CreateButton/CreateButton"
import PageHeader from "@/components/ui/PageHeader/PageHeader"
import { useCampaign } from "@/context/campaign/useCampaign"
import styles from "./Players.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useCallback, useEffect, useState } from "react"
import Editor from "@/components/Editor/Editor"
import { CampaignInvite, CampaignInviteStatus } from "@/types/api/campaignInvite"
import Loader from "@/components/ui/Loader/Loader"
import { Astroid, CircleAlert, Flag, PartyPopper, Send, Trash2, UserRound } from "lucide-react"
import { CampaignMember } from "@/types/api/campaignMember"

export default function Players () {
  const { activeCampaign } = useCampaign()
  const [ sendStatus, setSendStatus ] = 
    useState<{ message: string, type: string } | null>(null)
  const [ players, setPlayers ] = useState<CampaignMember[]>([])
  const [ invites, setInvites ] = useState<CampaignInvite[]>([])
  const [ inviteEmail, setInviteEmail ] = useState<string>("")
  const [ openEditor, setOpenEditor ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<{ id: number, action: string } | null>(null)

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/campaigns/${activeCampaign?.id}/players`, 
        { method: "GET" }
      )
      if (response.ok) {
        const players = await response.json()
        if (players) setPlayers(players)
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }
    } catch (error) {
      if (error instanceof Error) 
        console.error("Failed to fetch players: ", error.message)
      else console.error("Failed to fetch players: ", error)
    }
  },[activeCampaign?.id])

  const fetchInvites = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/campaigns/${activeCampaign?.id}/invites`, 
        { method: "GET" }
      )
      if (response.ok) {
        const invites = await response.json()
        if (invites) setInvites(invites)
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }
    } catch (error) {
      if (error instanceof Error) 
        console.error("Failed to fetch invitations: ", error.message)
      else console.error("Failed to fetch invitations: ", error)
    }
  },[activeCampaign?.id])

  useEffect(() => {
    if (activeCampaign) {
      fetchPlayers()
      fetchInvites()
    }
  },[activeCampaign, fetchPlayers, fetchInvites])

  const sendInvite = async () => {
    if (!activeCampaign) return
    setSendStatus(null)
    try {
      if (!inviteEmail)
        throw new Error("An email address is required to send a campaign invitation.")

      setLoading({ id: 0, action: "CREATE" })
      const response = await fetch(`/api/campaigns/${activeCampaign?.id}/invites`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail })
      })

      if (response.ok) {
        const newInvite = await response.json()
        setInvites([...invites, newInvite])
        setOpenEditor(false)
        setSendStatus({ message: "Invitation Sent!", type: "success" })
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }
      
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to send invitation: ", error.message)
        setSendStatus({ message: error.message, type: "error" })
      } else {
        console.error("Failed to send invitation: ", error)
      }
    } finally {
      setLoading(null)
    }
  }

  const resendInvite = async (id: number) => {
    setSendStatus(null)
    try {
      setLoading({ id, action: "RESEND" })
      const response = await fetch(
        `/api/campaign-invites/${id}/resend`, 
        { method: "POST"}
      )
      if (response.ok) {
        const resentInvite = await response.json()
        setInvites((prev) => 
          prev.map((invite) => 
            invite.id === resentInvite.id ? resentInvite : invite
          )
        )
        setSendStatus({ message: "Invitation Resent!", type: "success" })
      } else {
        const error = await response.json()
        if (error.message) throw new Error(error.message)
        else throw new Error("Failed for unknown reason. Try again later.")
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to resend invitation: ", error.message)
        setSendStatus({ message: error.message, type: "error" })
      } else {
        console.error("Failed to resend invitation: ", error)
      }
    } finally {
      setLoading(null)
    }
  }

  const deleteInvite = async (id: number) => {
    setSendStatus(null)
    try {
      setLoading({ id, action: "DELETE" })
      const response = await fetch(
        `/api/campaign-invites/${id}`, 
        { method: "DELETE"}
      )
      if (response.ok) {
        fetchInvites()
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete invitation: ", error.message)
        setSendStatus({ message: error.message, type: "error" })
      } else {
        console.error("Failed to delete invitation: ", error)
      }
    } finally {
      setLoading(null)
    }
  }

  const getTimeUntilExpiration = (expiresAt: string) => {
    const now = new Date()
    const expiration = new Date(expiresAt)

    const diff = expiration.getTime() - now.getTime()
    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 1) return "Expires in < 1 day"

    return `Expires in ${days} ${days === 1 ? "day" : "days"}`
  }

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader
        title="Players"
        activeCampaign={activeCampaign}/>
      <div className={styles.invitation_input}>
        <CreateButton 
          text="Invite Player"
          onClick={() => setOpenEditor(!openEditor)}
        />
        {sendStatus && 
          <div className={`${styles.status_message} ${sendStatus?.type === "error" ? styles.error : styles.success}`}>
            {sendStatus?.type === "error"
              ? <CircleAlert/>
              : <PartyPopper/>
            }
            <p>{sendStatus?.message}</p>
          </div>
        }
      </div>
      {openEditor && <Editor
        onClose={() => setOpenEditor(false)}
        header={<><span>Invite player</span> to {activeCampaign?.name}</>}
        children={
          <>
            <p>Enter the player’s email below, and we’ll send them an invitation to join.</p>
            <div className={styles.invitation_input}>
              <p>Email:</p>
              <input 
                type="text"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className={layoutStyles.dark_input}
              />
            </div>
            {loading?.action === "CREATE"
              ? <Loader/>
              : <button 
                  className={layoutStyles.green_button}
                  onClick={() => sendInvite()}
                >Send Invite</button>}
          </>
        }
      />}
      <h2>Players</h2>
        {players.length > 0 ? (
          players.map((player) => 
            <div className={layoutStyles.non_interactive_card}>
              <div className={layoutStyles.card_header}>
                <div className={layoutStyles.card_flex}>
                  <UserRound color={"var(--qb-alien-green)"}/>
                  <div>
                    <h3>{player.user.displayName}</h3>
                    <p>{player.user.email}</p>
                  </div>
                </div>
                <div className={layoutStyles.card_properties}>
                  <div className={`${layoutStyles.card_flex} ${styles.role}`}>
                    <Astroid size={20}/>
                    <p>{player.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <p>No players found.</p>
        )}
      <h2>Invites</h2>
      {invites.length > 0 ? (
        invites.map((invite) => 
          <div className={layoutStyles.non_interactive_card}>
            <div className={layoutStyles.card_header}>
              <div className={layoutStyles.card_flex}>
                <UserRound color={"var(--qb-alien-green)"}/>
                <h3>{invite.email}</h3>
              </div>
              <div className={layoutStyles.card_properties}>
                <div className={`${layoutStyles.card_flex} ${styles.expires_at}`}>
                  <Flag size={20}/>
                  <p>{getTimeUntilExpiration(invite.expiresAt)}</p>
                </div>
                <p className={styles[invite.status]}>{invite.status}</p>
                {loading?.id === invite.id && loading?.action === "RESEND" ? (
                  <Loader/>
                ) : (
                  invite.status != CampaignInviteStatus.ACCEPTED && 
                    <div 
                      className={`${layoutStyles.card_flex} ${styles.resend}`}
                      onClick={() => resendInvite(invite.id)}
                    ><Send/>Resend</div>
                )}
                {loading?.id === invite.id && loading?.action === "DELETE" 
                  ? <Loader/>
                  : <Trash2
                      className={layoutStyles.trash_icon}
                      onClick={() => deleteInvite(invite.id)}
                    />
                }
              </div>
            </div>
          </div>
        )
      ) : (
        <p>No invitations sent yet.</p>
      )}
    </div>
  )
}