import React from 'react'
import { Input } from './ui/input'
export default function SearchInfo({className}) {
  return (
    <div className={`${className}`}>
        <div className="">
        <Input
          type="text"
          placeholder="Rechercher une filière..."
        />
      </div>

    </div>
  )
}
