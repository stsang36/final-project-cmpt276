import style from './style.module.css'

const Button = ({text, onClick, className}) => 
{
  return (
    <button 
      className={`${style.button} ${className}`}
      onClick={onClick}>
      {text}
    </button>
  )
}

export default Button