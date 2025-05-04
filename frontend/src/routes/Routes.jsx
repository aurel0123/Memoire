import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import Dashbord from '@/layouts/Dashbord'
import Home from '@/components/Home'
import Filiere from '@/pages/filiere'
import Enseignant from '@/pages/enseignant'
import Etudiantlicence from '@/pages/etudiantsl'
import ListeEtu from '@/pages/listeetu'
import FilieresList from "@/pages/FilieresList"
import BinomesList from "@/pages/BinomesList"
import GestBinome from '@/pages/GestBinome'
import Planning from '@/pages/Planning'
import FormsPlanning from '@/pages/FormsPlanning'
import ListEtudiant from '@/pages/ListEtudiant'
import HomeEvents from '@/layouts/AppEvents/HomeEvents'
import Inscription from '@/pages/Authentication_and_Register/Inscription'
import Connexion from '@/pages/Authentication_and_Register/Connexion'
import PrivateRoute from '@/components/PrivateRoute'
import { AuthProvider } from '@/context/AuthContext'
import Event from '@/pages/Evenements/Event'
import CreateEvent from '@/pages/Evenements/CreateEvent'
import ListEvents from '@/pages/Evenements/ListEvents'
import EditEvent from '@/pages/Evenements/EditEvent'
import ViewsEvenement from '@/pages/Evenements/ViewsEvenement'
import AddCandidat from '@/pages/Candidats/AddCandidat'
import EditCandidat from '@/pages/Candidats/EditCandidat'
import NotFoundError from '@/pages/Error/not-found-error'
import Users from '@/pages/users/Users'
export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home-events" element={<HomeEvents />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path='/home-events/event/:eventId' element={<Event/>} />

          {/* Routes protégées */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashbord />
            </PrivateRoute>
          }>
            <Route index element={<Home />} />
            <Route path="filiere" element={<Filiere />} />
            <Route path="enseignant" element={<Enseignant />} />
            <Route path="etudiantlicence" element={<Etudiantlicence />} />
            <Route path="etudiantlicence/listeetu/:filiereId" element={<ListeEtu />} />
            <Route path="filiereslist" element={<FilieresList />} />
            <Route path="filiereslist/binomes/:filiereId" element={<BinomesList />} />
            <Route path="listeetudiant" element={<ListEtudiant />} />
            <Route path="listeetudiant/gestbinome/:filiereId" element={<GestBinome />} />
            <Route path="planninglicence" element={<Planning />} />
            <Route path="planninglicence/formsPlanning" element={<FormsPlanning />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="list-events" element={<ListEvents />} />
            <Route path="edit-event/:eventId" element={<EditEvent />} />
            <Route path ="event/:eventNom/:Id/candidats" element={<ViewsEvenement/>}/>
            <Route path ="event/:eventNom/:Id/candidats/add" element={<AddCandidat/>}/>
            <Route path ="event/:eventNom/:Id/candidats/edit/:candidatId" element={<EditCandidat/>}/>
            <Route path='users' element= {<Users/>} />
          </Route>

          <Route path="*" element={<NotFoundError/>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

