import { useCampaign } from "@/context/campaign/useCampaign"
import styles from "./CampaignEmptyState.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import Dropdown, { DropdownOption } from "../Dropdown/Dropdown"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CreateButton from "../ui/CreateButton/CreateButton"

interface CampaignEmptyStateProps {
  type: string
}

export default function CampaignEmptyState ({ type }: CampaignEmptyStateProps) {
  const navigate = useNavigate()
  const { campaigns, activeCampaignId, setActiveCampaignId } = useCampaign()
  const [campaignDropdownOptions, setCampaignDropdownOptions] = useState<DropdownOption[]>([])

  // configure dropdown
  useEffect(() => {
    if (campaigns.length > 0) {
      const options = campaigns.map((campaign) => ({
        label: campaign.name,
        value: String(campaign.id),
      }))
      setCampaignDropdownOptions(options)
    }
  },[campaigns])

  const switchCampaign = (id: string) => {
    setActiveCampaignId(id)
    localStorage.setItem("activeCampaign", id);
  }

  return (
    <div className={layoutStyles.no_results}>
      <div>
        <h2>
        Create {campaigns.length > 0 ? "or Select " : ""}a Campaign
        </h2>
        <p>A campaign is require to manage {type}.</p>
      </div>
      <CreateButton
        text="Create a new campaign"
        onClick={() => navigate("/campaigns")}
      />
      {
        campaigns.length > 0 &&
          <>
            <div className={styles.or_divider}>
              <hr />
              <p>or</p>
              <hr />
            </div>
            <Dropdown
              options={campaignDropdownOptions}
              value={activeCampaignId}
              onChange={(c) => switchCampaign(c)}
              className={styles.no_results_dropdown}
            ></Dropdown>
          </>
      }
    </div>
  )
}