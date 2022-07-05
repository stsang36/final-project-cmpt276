import PropTypes from 'prop-types'

const Button = ({text, onClick, style}) => 
{
  return (
    <input  type='submit' 
            onClick={onClick} 
            value={text}
            style={style}
    />
  )
}

Button.defaultProps = {text: 'Log in'}

Button.propTypes = 
{
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default Button