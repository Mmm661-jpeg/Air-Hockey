import { useState } from 'react'

import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import SinglePage from './pages/SinglePage'
import MainMenu from './pages/MainMenu'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainMenu/>}/>
        <Route path='/singleplayer' element={<SinglePage/>}/>
      </Routes>
    </Router>
  )
}

export default App
