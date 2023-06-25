import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button';


function ButtonLogin() {

    const [login, setLogin] = useState()

    useEffect(() => {
        
    })

  return (
    <NavLink to="/login">
        <Button variant="outline-success" className='buttonLogin'><h4 className='buttonLogin'>Login</h4></Button>
    </NavLink>
  )
}

export default ButtonLogin