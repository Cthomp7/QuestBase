import { Link, useNavigate } from "react-router-dom"
import styles from "./DashboardNavigation.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useEffect, useState } from "react"
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown"
import { useCampaign } from "@/context/campaign/useCampaign"
import ProfilePicture from "@/assets/imgs/profiles/Ribbert.png"
import { useAuth } from "@/context/AuthContext"
import MenuDropdown from "../MenuDropdown/MenuDropdown"
import { ArrowLeft, PlusIcon } from "lucide-react"

const DashboardNavigation = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { campaigns, activeCampaignId, setActiveCampaignId } = useCampaign()
  const [campaignDropdownOptions, setCampaignDropdownOptions] = useState<DropdownOption[]>([])
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  const pages = [
    { name: "Quests", url: "/quests" }
  ]

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

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <div className={styles.dashboard_navigation}>
      <div>
        <section className={styles.dashboard_header}>
          <div className={styles.dashboard_header_qb}>
            <ArrowLeft className={styles.qb_arrow}/>
            <Link to="/"><h1>Quest<span>Base</span></h1></Link>
          </div>
          <div className={styles.dashboard_user_navigation}>
            <img 
              src={ProfilePicture} 
              alt="Profile Picture of Ribbert the Frog"
              className={styles.profile_picture} 
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            />
            <div className={styles.tooltip}>Open user navigation menu</div>
          </div>
          <MenuDropdown
            open={accountMenuOpen}
            style={{ 
              top: 0,
              left: '100%', 
              margin: "0 0 0 20px",
              width: "100%"
            }}
            children={
              <>
                <div className={styles.account_info}>
                  <img 
                    src={ProfilePicture} 
                    alt="Profile Picture of Ribbert the Frog"
                    className={styles.profile_picture}
                  />
                  <div>
                    <p className={styles.user_display_name}>{user?.displayName}</p>
                    <p className={styles.user_email}>{user?.email}</p>
                  </div>
                </div>
                <hr />
                <Link to="/settings">Settings</Link>
                <Link onClick={() => logout(redirectToLogin)} to="#">Logout</Link>
              </>
            }
          ></MenuDropdown>
        </section>
        <section className={styles.navigation_section}>
          <div className={styles.campaign_container}>
            <p>Campaign:</p>
            <button onClick={() => navigate("/campaigns")}>view all</button>
          </div>
          {campaigns.length > 0 
            ? <Dropdown
                options={campaignDropdownOptions}
                value={activeCampaignId}
                onChange={(c) => switchCampaign(c)}
              ></Dropdown>
            : <div 
                className={`${layoutStyles.create_button} ${layoutStyles.mini}`}
              >
                <div className={layoutStyles.plus_icon}>
                  <PlusIcon />
                </div>
                <p onClick={() => navigate("/campaigns")}>Create a new campaign</p>
              </div>
          }
        </section>
        <section className={styles.navigation_pages}>
          {pages.map((p) => (
            <div
              key={p.url}
              className={styles.navigation_page}
              onClick={() => navigate(p.url)}
            >
              <p>{p.name}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default DashboardNavigation