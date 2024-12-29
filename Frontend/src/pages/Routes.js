import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './Auth/Register'
import Login from './Auth/Login'
import Frontend from './Frontend'
import Event from './Events/Event'
import AddEvent from './Events/AddEvent'


export default function Index() {
  return (
    <Routes>
     <Route path='/' element = {<Register/>}/>
     <Route path='/login' element = {<Login/>}/>
     <Route path='/frontend' element={<Frontend/>}/>
     <Route path='/event' element={<Event/>}/>
     <Route path='/addEvent' element={<AddEvent/>}/>
    </Routes>
  )
}
