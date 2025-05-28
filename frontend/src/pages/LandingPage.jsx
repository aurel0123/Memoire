import React , {useContext} from 'react'
import { Button } from '@/components/ui/button'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import NavBar from '@/components/NavBar'
import HeroSection from './Home/HeroSection'

export default function LandingPage() {
  return (
    <div>
      <NavBar/>
      <HeroSection />
    </div>
  )
}
