import { useState } from 'react'

import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import SinglePage from './pages/SinglePage.jsx'
import MainMenu from './pages/MainMenu.jsx'
import MultiPage from './pages/MultiPage.jsx'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainMenu/>}/>
        <Route path='/singleplayer' element={<SinglePage/>}/>
        <Route path='/multiplayer' element = {<MultiPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
