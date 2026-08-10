import { useCampaign } from "@/context/campaign/useCampaign"
import styles from "./Npcs.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import PageHeader from "@/components/ui/PageHeader/PageHeader"
import CampaignEmptyState from "@/components/CampaignEmptyState/CampaignEmptyState"
import CreateButton from "@/components/ui/CreateButton/CreateButton"
import { useCallback, useEffect, useState } from "react"
import NpcEditor from "./NpcEditor"
import { CreateNpcRequest, Npc } from "@/types/api/npc"
import { useAuth } from "@/context/AuthContext"
import { Briefcase, ChartNoAxesColumnIncreasing, IdCard } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Npcs () {
  const { user } = useAuth()
  const { activeCampaign } = useCampaign()
  const navigate = useNavigate()
  const [ npcs, setNpcs ] = useState<Npc[]>([])
  const [ openCreateEditor, setOpenCreateEditor ] = useState<boolean>()

  const toggleEditor = () => {
    setOpenCreateEditor(!openCreateEditor)
  }

  const fetchNpcs = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const response = await fetch(
        `/api/campaigns/${activeCampaign.id}/npcs`,
        { method: "GET" }
      )
      if (response.ok) {
        const npcs = await response.json();
        setNpcs(npcs);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Failed to fetch npcs: ", error);
    }
  }, [activeCampaign?.id])
  
  useEffect(() => {
    if (user && activeCampaign?.id) {
      fetchNpcs()
    }
  }, [user, activeCampaign, fetchNpcs])

  const createNpc = async (npcRequest: CreateNpcRequest) => {
    try {
      validateNPCRequest(npcRequest)
      const response = await fetch('/api/npcs', { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(npcRequest)
      })
      if (response.ok) {
        const newNpc = await response.json()
        setNpcs([...npcs, newNpc])
        toggleEditor()
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create NPC: ", error)
    }
  }

  const validateNPCRequest = (npc: CreateNpcRequest) => {
    if (!npc.name) {
      throw new Error("A name is required.")
    }
  }

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader 
        title="NPCs"
        activeCampaign={activeCampaign}/>
      {openCreateEditor && <NpcEditor
          action="Create"
          onTrigger={(npc: CreateNpcRequest) => createNpc(npc)}
          onClose={toggleEditor}
        />}
      {!activeCampaign ? (
        <CampaignEmptyState type={"NPCs"} />
      ) : npcs.length > 0 ? (
        <>
          {!openCreateEditor &&<CreateButton
            text="Create an NPC"
            onClick={toggleEditor}
          />}
          {npcs.map((npc) => (
            <div key={npc.id} className={layoutStyles.card} onClick={() => navigate(`/npcs/${npc.id}`)}>
              <div className={layoutStyles.card_header}>
                <h2>{npc.name}</h2>
                <div className={layoutStyles.card_properties}>
                  {npc.status && <p className={`${styles.npc_property} ${styles.npc_status} ${styles[npc.status]}`}>{npc.status}</p>}
                  {npc.role && <p className={`${styles.npc_property} ${styles.npc_role} ${styles[npc.role]}`}>{npc.role.replace(/_/g, " ")}</p>}
                </div>
              </div>
              <div className={styles.npc_traits}>
                {npc.level && <div>
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
          ))}
        </>
      ) : (
        <>
          {!openCreateEditor && 
            <div className={layoutStyles.no_results}>
              <div>
                <h2>No NPCs Found</h2>
                <p>Create a new NPC for your campaign below!</p>
              </div>
              <CreateButton
                text="Create an NPC"
                onClick={() => toggleEditor()}
              />
            </div>
          }
        </>
      )}
    </div>
  )
}