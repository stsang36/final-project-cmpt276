
export const fileButtonVariants = {
  hover: disabled => {
    if(!disabled){
      return {
        scale: 1.05,
        cursor: 'pointer'
      }
    }
    return
  },
  tap: disabled => {
    if(!disabled){
      return{
        scale: 0.95
      }
    }
  }
}