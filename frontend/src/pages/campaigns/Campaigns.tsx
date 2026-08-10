import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import styles from "./Campaigns.module.css"
import { Campaign } from "@/types/api/campaign";
import { useRef, useState } from "react"
import CloseIcon from "../../assets/x.svg?react"
import EditIcon from "../../assets/edit.svg?react"
import PlusIcon from "../../assets/plus.svg?react"
import TrashIcon from "../../assets/trash.svg?react"
import { useCampaign } from "@/context/campaign/useCampaign";
import CampaignBanner from "@/assets/imgs/Campaign_Banner.png"

// TODO: add a loading sequence between fetchCampaigns

const Campaigns = () => {
  const { campaigns, setCampaigns, setActiveCampaignId } = useCampaign()
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null)
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [system, setSystem] = useState<string>("")
  const [deleteText, setDeleteText] = useState<string>("")
  const [editorButton, setEditorButton] = useState<string>("Create")
  const [editorHeading, setEditorHeading] = useState<string>("Create a campaign")

  const editorRef = useRef<HTMLDivElement>(null)
  const deletionPopupRef = useRef<HTMLDivElement>(null)

  const openEditor = (campaign: Campaign | null) => {
    if (campaign) {
      setEditorHeading("Edit campaign")
      setEditorButton("Update")
      setName(campaign?.name)
      setDescription(campaign?.description)
      setSystem(campaign?.system)
      setCurrentCampaign(campaign)
    } else {
      setEditorHeading("Create a campaign")
      setEditorButton("Create")
    }
    editorRef.current?.style.setProperty("display", "flex")
  }

  const closeEditor = () => {
    editorRef.current?.style.setProperty("display", "none")
  }

  const updateCampaign = () => {
    if (editorButton === "Create") addCampaign()
    else editCampaign()
  }

  const addCampaign = async () => {
    try {
      const response = await fetch("/api/campaigns", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, system }) 
      })
      const campaign = await response.json()
      setCampaigns([...campaigns, campaign])
      // set active campaign
      setActiveCampaignId(String(campaign.id))
      localStorage.setItem("activeCampaignId", String(campaign.id));
      closeEditor()
    } catch (error) {
      console.error("Failed to add new campaign: ", error)
    }
  }

  const editCampaign = async () => {
    if (!currentCampaign) {
      console.error("No current campaign selected.")
      return
    }
    try {
      const response = await fetch(`/api/campaigns/${currentCampaign.id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, system }) 
      })
      const json = await response.json()
      // replace old campaign instance
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === json.id ? json : campaign
        )
      )
      closeEditor()
    } catch (error) {
      console.error("Failed to edit campaign: ", error)
    }
  }

  const openDeletionPopup = (campaign: Campaign) => {
    setCurrentCampaign(campaign)
    deletionPopupRef.current?.style.setProperty("display", "flex")
  }

  const closeDeletionPopup = () => {
    deletionPopupRef.current?.style.setProperty("display", "none")
  }

  const deleteCampaign = async () => {
    if (!currentCampaign) {
      console.error("No current campaign selected.")
      return
    }
    if (currentCampaign?.name != deleteText) {
      console.error("Name inputted does not match campaign's name.")
      return
    }
    try {
      await fetch(`/api/campaigns/${currentCampaign.id}`, { method: "DELETE" })
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign.id !== currentCampaign.id)
      )
      closeDeletionPopup()
    } catch (error) {
      console.error("Failed to delete campaign: ", error)
    }
  }

  return (
    <>
      <div className={styles.campaigns_container}>
        <h1 className={layoutStyles.header}>Campaigns</h1>
        <hr className={styles.campaign_hr}/>
        {campaigns.length > 0 ? (
          <>
          <div className={layoutStyles.create_button} onClick={() => openEditor(null)}>
            <div className={layoutStyles.plus_icon}>
              <PlusIcon />
            </div>
            <p>Create a new campaign</p>
          </div>
          <div className={styles.campaigns}>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className={layoutStyles.card}>
                  <img 
                    className={styles.campaign_image} 
                    src={CampaignBanner} 
                    alt="Campaign banner image"
                  />
                  <div className={styles.campaign_content}>
                    <div className={styles.campaign_text}>
                      <p className={layoutStyles.card_title}>{campaign.name}</p>
                      <hr />
                      <p>{campaign.description}</p>
                    </div>
                    <div className={styles.campaign_bottom}>
                      <p className={styles.campaign_system}>{campaign.system}</p>
                      <div className={styles.campaign_actions}>
                        <EditIcon
                          className={styles.campaign_edit}
                          onClick={() => openEditor(campaign)} 
                        />
                        <TrashIcon 
                          className={styles.campaign_trash}
                          onClick={() => openDeletionPopup(campaign)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
        ) : (
          <div className={styles.no_results}>
            <div>
              <h2>No Campaigns Found</h2>
              <p>Start your new campaign below!</p>
            </div>
            <div className={layoutStyles.create_button} onClick={() => openEditor(null)}>
              <div className={layoutStyles.plus_icon}>
                <PlusIcon />
              </div>
              <p>Create a new campaign</p>
            </div>
          </div>
        )}
      </div>
      {/* Campaign Editor */}
      <div ref={editorRef} className={styles.campaign_editor}>
        <div className={styles.editor_content}>
          <div className={styles.editor_title}>
            <h1>{editorHeading}</h1>
            <CloseIcon
              className={styles.closeIcon} 
              onClick={closeEditor}
            />
          </div>
          <p>Name:</p>
          <input 
            type="text" 
            name="name" 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Description:</p>
          <textarea 
            className={styles.description}
            name="description" 
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>System:</p>
          <input 
            type="text" 
            name="system" 
            placeholder="System (ex: D&D 5th Edition)"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
          />
          <button onClick={updateCampaign}>{editorButton}</button>
        </div>
      </div>
      {/* Delete warning message */}
      <div ref={deletionPopupRef} className={styles.campaign_editor}>
        <div className={styles.editor_content}>
          <div className={styles.editor_title}>
            <h1>Delete Campaign</h1>
            <CloseIcon
                className={styles.closeIcon} 
                onClick={closeDeletionPopup}
              />
          </div>
          <p>Are you sure you want to delete <b>{currentCampaign?.name}</b>?</p>
          <p>If so, please type in the campaign name below and press delete.</p>
          <input 
            type="text"
            name="delete-text"
            placeholder={currentCampaign?.name}
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            autoComplete="off"
          />
          <button onClick={deleteCampaign}>Delete</button>
        </div>
      </div>
    </>
  )
}

export default Campaigns