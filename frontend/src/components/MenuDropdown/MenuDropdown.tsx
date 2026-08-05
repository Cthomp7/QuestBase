import styles from "./MenuDropdown.module.css"

interface MenuDropdownProps {
  children: React.ReactNode
  style?: React.CSSProperties
  open: boolean
  mobile?: boolean
  textAlign?: string
}

export default function MenuDropdown ({ 
  children, 
  style, 
  open, 
  mobile, 
  textAlign 
}: MenuDropdownProps) {

  const menuClassName = [
    styles.menu_dropdown,
    open && styles.open,
    mobile && styles.mobile,
    textAlign === "right"
      ? styles.align_right
      : styles.align_left
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
        className={menuClassName}
        style={style}
      >
        {children}
      </div>
  )
}