import React , {useContext} from 'react'
import { Button } from '@/components/ui/button'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import NavBar from '@/components/NavBar'
import Hero from '@/layouts/Hero'

export default function LandingPage() {
  return (
    <div>
      <NavBar/>
    </div>
  )
}
