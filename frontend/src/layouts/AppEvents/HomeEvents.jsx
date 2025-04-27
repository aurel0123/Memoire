import React from 'react'
import Hero from '../Hero'
import Events from '@/pages/Evenements/Events'
import NavBar from '@/components/NavBar'

export default function HomeEvents() {
  return (
    <div>
      <div className="relative">
        <div className='glass-navbar'>
        <NavBar/>
      </div>
      </div>
      
      <div className='pt-16'>
        <Hero/>
      </div>
      
      <Events/>
    </div>
  )
}
