//  generate inline styling for modal OPTIONS: 'leftpeek','rightpeek','toppeek', 'bottompeek', 'center' <<DEFAULT>>
export const generateModalOrientation = (type) => {
  const style = { 
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center'
  }
  const modalType = type ? type.toLowerCase() : ''
  if(modalType === 'leftpeek'){
    style.justifyContent = 'flex-start'
    style.alignItems = 'stretch'
    return style
  }
  if(modalType === 'rightpeek'){
    style.justifyContent = 'flex-end'
    style.alignItems = 'stretch'
    return style
  }
  if(modalType === 'toppeek'){
    style.flexFlow = 'column nowrap'
    style.justifyContent = 'flex-start'
    style.alignItems = 'stretch'
    return style
  }
  if(modalType === 'bottompeek'){
    style.flexFlow = 'column nowrap'
    style.justifyContent = 'flex-end'
    style.alignItems = 'stretch'
    return style
  }
  return style
}

export const generateModalVariants = (type) => {
  const modalType = type ? type.toLowerCase() : ''
  if(modalType === 'leftpeek'){
    return {
      hidden: { x: '-100%' },
      visible: { 
        x: '0',
        transition: {
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        } 
      },
      exit: { x: '-100%' }
    }
  }
  if(modalType === 'rightpeek'){
    return {
      hidden: { x: '100%' },
      visible: { 
        x: '0',
        transition: {
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        } 
      },
      exit: { 
        x: '100%',
      },
    }
  }
  if(modalType === 'toppeek'){
    return {
      hidden: { y: '-100%' },
      visible: { 
        y: '0',
        transition: {
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        } 
      },
      exit: { y: '-100%' },
    }
  }
  if(modalType === 'bottompeek'){
    return {
      hidden: { y: '100%' },
      visible: { 
        y: '0',
        transition: {
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        } 
     },
      exit: { y: '100%' }
    }
  }
  return {
    hidden: { y: '-100vh' },
    visible: { 
      y: '0',
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.7
      } 
    },
    exit: { y: '100vh' }
  } 
}

export const backdropVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  }
}