import React from 'react'
import { Helmet } from 'react-helmet'

const Layout = ({children, title}) => {
  return (
    <>
      <Helmet>
        <title>
          {title}
        </title>
      </Helmet>
      {/* can put a header here */}
      {children}
      {/* can put a footer here */}
    </>
  )
}

export default Layout