import RegisterForm from '@/components/RegisterForm'
import { GraduationCap } from 'lucide-react'
import React , {useState}from 'react'
import axios from 'axios'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle , AlertDialogDescription} from '@/components/ui/alert-dialog'
import {Link} from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import FeatureColumn from './FeatureColumn'

export default function Inscription() {
    const logo = {
        url: "/",
        icon: GraduationCap,
        alt: "logo",
        title: "Logo",
    }
    const [open, setOpen] = useState(false)
    const AlertMessage = () => (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent >
                <AlertDialogHeader>
                    <AlertDialogTitle>Inscription réussie</AlertDialogTitle>
                    <AlertDialogDescription>
                        Merci beaucoup pour votre inscription. Veuillez patientez, le temps que nous traitons votre demande.
                        Un message contenant les information de votre compte vous sera envoyé par mail.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>
                        <Link to="/">
                            Continuer
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
    const [user, setUser] = useState({})
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (user.nom==="" && user.prenom ==="" && user.email ===""){
            alert("Veuillez remplir tous les champs")
        }else{
            try{
                const response = await axios.post("http://127.0.0.1:8000/inscription/", user)
                setOpen(true)
                
            }catch(error){
                const errorMessage = error.response?.data?.error || "Une erreur s'est produite lors de l'inscription."
                toast.error("Message d'erreur", {description: errorMessage})
            }
        }

    }
    const handlechange = (event) => {
        const {name, value} = event.target
        setUser((prev)=>{
            return {...prev, [name]: value} 
        }) 
    }
    console.log()
  return (
    <div className='flex h-screen w-full bg-slate-50'>
        <Toaster position="top-center" richColors closeButton />
            <FeatureColumn />
            <div className="flex w-1/2 items-center justify-center p-8">
               <RegisterForm handlechange={handlechange} handleSubmit={handleSubmit}/>
            </div>
        {open && <AlertMessage />}
    </div>
  )
}
