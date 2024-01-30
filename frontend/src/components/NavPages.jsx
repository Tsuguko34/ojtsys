import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import RegistrationPage from '../pages/RegistrationPage'
import HomePage from '../pages/HomePage'


function NavPages(){
    return(
        <Routes>
            <Route path='/' index element={<LoginPage/>}/>
            <Route path='/Login' element={<LoginPage/>}/>
            <Route path='/Registration' element={<RegistrationPage/>}/>
            <Route path='/Home' element={<HomePage/>}/>
        </Routes>
    )
}

export default NavPages