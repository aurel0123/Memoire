import LoginForm from '@/components/LoginForm'
import FeatureColumn from '@/pages/Authentication_and_Register/FeatureColumn'
import {useNavigate} from 'react-router-dom'
import { useContext, useEffect } from 'react';  
import AuthContext from '@/context/AuthContext';

export default function Connexion() {
    const navigate = useNavigate() ; 
    const {isAuthenticated} = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50">
        {/* Première colonne - Logo et fonctionnalités */}
        <FeatureColumn />
        
        {/* Deuxième colonne - Formulaire de connexion */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-4 md:p-8">
            <LoginForm className="w-full max-w-md" />
        </div>
    </div>
    )
}
