import { XIcon } from "lucide-react"
import styles from "./Editor.module.css"

interface EditorProps {
  children: React.ReactNode
  header: string | React.ReactNode
  onClose: () => void
}

export default function Editor ({ children, header, onClose }: EditorProps) {
  return (
    <div className={styles.editor}>
      <div className={styles.editor_title}>
          <h2>{header}</h2>
          <XIcon
            className={styles.green_close_icon} 
            onClick={onClose}
          />
      </div>
      {children}
    </div>
  )
}