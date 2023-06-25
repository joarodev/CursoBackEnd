import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';


function AppRoutes() {
  return (
    <>
        <BrowserRouter>
          <NavBar/>
            <Routes>
                <Route path='/' element={<h1>Home</h1>}/>
                <Route path='*' element={<h1>Pagina no disponible</h1>}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default AppRoutes;