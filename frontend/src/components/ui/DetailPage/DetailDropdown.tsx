import style from "./DetailPage.module.css"

export interface DetailDropdownOption {
  icon: React.ReactNode
  text: string
}

interface DetailDropdownProps {
  options: DetailDropdownOption[]
  onSelect: (option: string) => void
}

export default function DetailDropdown ({ options, onSelect }: DetailDropdownProps) {

  return (
    <div className={style.dropdown}>
      {options.map((option, i) => 
        <div 
          key={i} 
          className={style.dropdown_option}
          onClick={() => onSelect(option.text)}
        >
          {option.icon}
          <p>{option.text}</p>
        </div>
      )}
    </div>
  )
}