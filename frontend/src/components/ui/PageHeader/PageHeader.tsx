import { Campaign } from "@/types/api/campaign"
import styles from "./PageHeader.module.css"

interface PageHeaderProps {
  title: string
  activeCampaign?: Campaign | null
}

export default function PageHeader ({ title, activeCampaign }: PageHeaderProps) {
  return (
    <>
      <div className={styles.header_container}>
        <h1 className={styles.header}>{title}</h1>
        {activeCampaign && <h2 className={styles.selected_campaign}>{activeCampaign?.name}</h2>}
      </div>
      <hr className={styles.hr}/>
    </>
  )
}