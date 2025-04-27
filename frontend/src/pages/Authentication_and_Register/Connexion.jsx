import { GraduationCap } from 'lucide-react'
import React from 'react'
import LoginForm from '@/components/LoginForm'
import { Link } from 'react-router-dom'

export default function Connexion() {
    const logo = {
        url: "/",
        icon: GraduationCap,
        alt: "logo",
        title: "Logo",
    }

    return (
        <div className='h-svh'>
            <div className='container h-full flex flex-col py-4'>
                <div className='w-full pl-11 lg:pl-2'>
                    <Link to={logo.url} className="flex items-center gap-2">
                        <logo.icon size={30} className="max-h-10 text-blue-900" />
                        <span className="text-lg font-semibold tracking-tighter">
                            {logo.title}
                        </span>
                    </Link>
                </div>
                <div className='flex items-center justify-center h-full'>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
