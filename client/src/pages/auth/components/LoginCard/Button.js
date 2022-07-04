import PropTypes from 'prop-types'
import style from './style.module.css'

const Button = ({text, onClick}) => 
{
  return (
    <input  type='submit' onClick={onClick} 
            className={style.Button} 
            value={text}/>
  )
}

Button.defaultProps = {text: 'Log in'}

Button.propTypes = 
{
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default Button