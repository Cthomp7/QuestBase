import { PlusIcon } from "lucide-react";
import styles from "./CreateButton.module.css"

interface CreateButtonProps {
  text: string
  size?: string
  onClick: () => void
}

export default function CreateButton ({ text, size = "regular", onClick }: CreateButtonProps) {
  return (
    <div 
      className={`${styles.create_button} ${styles?.[size]}`} 
      onClick={onClick}
    >
      <div className={styles.plus_icon}>
        <PlusIcon />
      </div>
      <p>{text}</p>
    </div>
  )
} 