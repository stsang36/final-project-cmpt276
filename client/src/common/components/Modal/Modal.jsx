import style from './style.module.css'
import { motion } from 'framer-motion'
import { generateModalOrientation, generateModalVariants, backdropVariants } from './utils'

const Modal = ({children, closeModal, type, className, inLineStyle}) => {
  return (
    <motion.div
      className={style.backdrop}
      style={generateModalOrientation(type)}
      onClick={closeModal}
      variants={backdropVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      <motion.dialog
        onClick={(e)=>e.stopPropagation()}
        open={true}
        className={className}
        style={inLineStyle}
        variants={generateModalVariants(type)}
      >
        {children}
      </motion.dialog>
    </motion.div>
  )
}

export default Modal