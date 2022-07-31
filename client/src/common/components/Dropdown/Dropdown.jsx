import style from './style.module.css'
import { useState, useEffect, useRef } from 'react'

const Dropdown = ({children}) => {
  const ref = useRef(null)
  const [ isOpen, setIsOpen ] = useState(false)

  useEffect(() => {
    const checkIfClickOutside = e => {
      if(isOpen && ref.current && !ref.current.contains(e.target)){
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickOutside)
    }
  },[isOpen])

  return (
    <div 
      className={style.dropdownWrapper}
      ref={ref}
    >
      <button 
        className={style.dropdownIcon}
        onClick={()=>setIsOpen(prev => !prev)}
      >
        {children[0]}
      </button>
      {isOpen &&
        <ul 
          className={style.dropdownMenu}
        >
          {children.filter((item, idx) => idx !== 0).map((child, index) => (
            <li 
              key={index}
              className={style.item}
              onClick={()=>setIsOpen(false)}
            >
              {child}
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default Dropdown