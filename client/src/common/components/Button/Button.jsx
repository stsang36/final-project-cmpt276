import style from './style.module.css'
import { motion } from 'framer-motion'

const Button = ({text, onClick, className, disabled}) => 
{
  return (
    <motion.button 
      whileTap={{scale: 0.9}}
      className={`${style.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </motion.button>
  )
}

export default Button