import { Npc as NpcType } from "@/types/api/npc"
import styles from "./Npcs.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useNavigate } from "react-router-dom"
import { Briefcase, ChartNoAxesColumnIncreasing, IdCard } from "lucide-react"

interface NpcProp {
  npc: NpcType
}

export default function Npc ({ 
  npc
}: NpcProp) {
  const navigate = useNavigate()

  return (
    <div
      className={layoutStyles.card} 
      onClick={() => navigate(`/npcs/${npc.id}`)}
    >
      <div className={layoutStyles.card_header}>
        <h2>{npc.name}</h2>
        <div className={layoutStyles.card_properties}>
          {npc.status && 
            <p className={`${styles.npc_property} ${styles.npc_status} ${styles[npc.status]}`}>
              {npc.status}
            </p>
          }
          {npc.role && 
            <p className={`${styles.npc_property} ${styles.npc_role} ${styles[npc.role]}`}>
              {npc.role.replace(/_/g, " ")}
            </p>
          }
        </div>
      </div>
      <div className={styles.npc_traits}>
        {npc.level > 0 && <div>
          <ChartNoAxesColumnIncreasing/>
          <p>Level {npc.level}</p>
        </div>}
        {npc.race && <div>
          <IdCard />
          <p>{npc.race}</p>
        </div>}
        {npc.occupation && <div>
          <Briefcase />
          <p>{npc.occupation}</p>
        </div>}
        {/* add class later */}
      </div>
    </div>
  )
}