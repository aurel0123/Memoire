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
import Planning from '@/pages/Planning'
import FormsPlanning from '@/pages/FormsPlanning'
import ListEtudiant from '@/pages/ListEtudiant'

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
          <Route path='listeEtudiant/gestbinome/:filiereId' element = {<GestBinome/>} />
          <Route path = "planninglicence" element ={<Planning/>} />
          <Route path='listeEtudiant' element = {<ListEtudiant/>} />
          <Route path = "planninglicence/formsPlanning" element = {<FormsPlanning/>} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  )
}
