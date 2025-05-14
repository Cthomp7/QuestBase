import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`${styles.dropdown} ${className ?? ""}`} ref={ref}>
      <button
        className={styles.dropdown_button}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span>{selected ? selected.label : "Select..."}</span>
      </button>
      {open && (
        <div className={styles.dropdown_menu}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={
                opt.value === value
                  ? styles.dropdown_option_selected
                  : styles.dropdown_option
              }
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
