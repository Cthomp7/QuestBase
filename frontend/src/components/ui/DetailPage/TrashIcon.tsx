import { Check, Trash2, X } from "lucide-react"
import { useState } from "react"
import styles from "./DetailPage.module.css"

interface TrashIconProps {
  onDelete: () => void
}

export default function TrashIcon ({ onDelete }: TrashIconProps) {
  const [ deleting, setDeleting ] = useState<boolean>(false)

  const handleDelete = () => {
    setDeleting(false)
    onDelete()
  }

  return (
    <>
      {!deleting && <Trash2
        className={styles.red_icon}
        onClick={(e) => {
          e.stopPropagation()
          setDeleting(true)
        }}
      />}
      {deleting && 
        <>
          <p>Are you sure?</p>
          <Check
            className={styles.green_icon}
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
          />
          <X
            className={styles.red_icon}
            onClick={(e) => {
              e.stopPropagation()
              setDeleting(false)
            }}
          />
        </>
      }
    </>
  )
}