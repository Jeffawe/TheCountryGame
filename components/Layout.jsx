import React from 'react'
import NavBar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div>
        <NavBar />
        {children}
        <Footer />
    </div>
  )
}

export default Layout