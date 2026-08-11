import styles from "./DetailNotFound.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"

interface DetailNotFoundProps {
  title: string | React.ReactNode
  message: string
  buttonText: string
  onClick: () => void
}

export default function DetailNotFound ({ 
  title,
  message,
  buttonText,
  onClick
}: DetailNotFoundProps) {
  return (
    <div className={layoutStyles.no_results}>
      <SmallSparkle 
        style={{ 
          fill: "var(--qb-periwinkle)",
          height: "30px",
          width: "30px"
        }}
      />
      <h2 className={styles.header}>{title}</h2>
      <p>{message}</p>
      <button 
        className={layoutStyles.green_button}
        onClick={onClick}
      >{buttonText}</button>
    </div>
  )
}