import { Check, SquarePen, Trash2, X } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import styles from "./DetailPage.module.css"
import { useState } from "react";

interface DetailPageProps {
  title: string
  children: React.ReactNode
  editting: boolean
  onEdit: (active: boolean) => void
  onDelete: () => void
}

export default function DetailPage ({ 
  title,
  children,
  editting,
  onEdit,
  onDelete 
}: DetailPageProps) {
  const [ deleting, setDeleting ] = useState<boolean>(false)

  const toggleEdit = () => {
    onEdit(!editting)
  }

  const handleDelete = () => {
    setDeleting(false)
    onDelete()
  }

  return (
    <>
      <div className={styles.header}>
        <PageHeader title={title}/>
        <div className={styles.toolbar}>
          <SquarePen
            className={`${styles.green_icon} ${editting ? styles.active : ""}`}
            onClick={toggleEdit}
          />
          {!deleting && <Trash2
            className={styles.red_icon}
            onClick={() => setDeleting(true)}
          />}
          {deleting && 
            <>
              <p>Are you sure?</p>
              <Check
                className={styles.green_icon}
                onClick={handleDelete}
              />
              <X
                className={styles.red_icon}
                onClick={() => setDeleting(false)}
              />
            </>
          }
        </div>
      </div>
      {children}
    </>
  )
}