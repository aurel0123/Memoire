import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import Dashbord from '@/layouts/Dashbord'
import Home from '@/components/Home'
import Filiere from '@/pages/filiere'
import Enseignant from '@/pages/enseignant'
import Etudiantlicence from '@/pages/etudiantsl'
import ListeEtu from '@/pages/listeetu'
import FilieresList from "@/pages/FilieresList";
import BinomesList from "@/pages/BinomesList";
import GestBinome from '@/pages/GestBinome'


export default function routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path='dashboard' element={<Dashbord/>}>
          <Route index element={<Home/>} />
          <Route path="filiere" element={<Filiere/>} />
          <Route path="Enseignant" element={<Enseignant/>} />
          <Route path="Etudiantlicence/listeetu/:filiereId" element={<ListeEtu />} />
          <Route path="Etudiantlicence" element={<Etudiantlicence />}/>
          <Route path="FilieresList/binomes/:filiereId" element={<BinomesList />} />
          <Route path="FilieresList" element={<FilieresList />} />
          <Route path='gestbinome' element = {<GestBinome/>} />
          
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  )
}
