import style from './style.module.css'

const Button = ({text, onClick, className, disabled}) => 
{
  return (
    <button 
      className={`${style.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button