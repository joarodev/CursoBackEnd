import React from 'react'
import { Link } from 'react-router-dom'

function NavItem(props) {
  return (
    <Link className='navLink' to={props.to}>
        <h4 className='navItems'>{props.name}</h4>
    </Link>
  )
}

export default NavItem