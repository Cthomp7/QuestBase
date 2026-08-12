import { Plus, SquarePen } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import styles from "./DetailPage.module.css"
import { useState } from "react";
import DetailDropdown, { DetailDropdownOption } from "./DetailDropdown";
import TrashButton from "./TrashIcon";

interface DetailPageProps {
  title: string
  children: React.ReactNode
  dropdownOptions?: DetailDropdownOption[]
  editting: boolean
  onAdd?: (option: string) => void
  onEdit: (active: boolean) => void
  onDelete: () => void
}

export default function DetailPage ({ 
  title,
  children,
  dropdownOptions,
  editting,
  onAdd,
  onEdit,
  onDelete 
}: DetailPageProps) {
  
  const [ adding, setAdding ] = useState<boolean>(false)

  const toggleEdit = () => {
    onEdit(!editting)
  }

  const handleSelect = (option: string) => {
    setAdding(!adding)
    onAdd?.(option)
  }

  return (
    <>
      <div className={styles.header}>
        <PageHeader title={title}/>
        <div className={styles.toolbar}>
          {(onAdd && dropdownOptions) && 
           <>
              <Plus 
                className={`${styles.green_icon} ${styles.add_icon} ${adding ? styles.active : ""}`}
                onClick={() => setAdding(!adding)}
              />
              {adding && 
                <DetailDropdown
                  options={dropdownOptions}
                  onSelect={handleSelect}
                />
              }
            </>
          }
          <SquarePen
            className={`${styles.blue_icon} ${editting ? styles.active : ""}`}
            onClick={toggleEdit}
          />
          <TrashButton onDelete={onDelete}/>
        </div>
      </div>
      {children}
    </>
  )
}