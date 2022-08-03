import style from './style.module.css'
import { motion } from 'framer-motion'

const Button = ({text, onClick, className, disabled, onKeyPress, tabIndex}) => 
{
  return (
    <motion.button 
      whileTap={{scale: 0.9}}
      className={`${style.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
      onKeyPress={onKeyPress}
      tabIndex={tabIndex}
    >
      {text}
    </motion.button>
  )
}

export default Button