import { LoaderCircle } from "lucide-react";
import styles from "./Loader.module.css"

export default function Loader () {
  return (
    <div className={styles.loader_circle_wrapper}>
      <LoaderCircle className={styles.loader_circle} size={48} color="currentColor"/>
    </div>
  )
}