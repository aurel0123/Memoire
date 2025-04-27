import RegisterForm from '@/components/RegisterForm'
import { GraduationCap } from 'lucide-react'
import React , {useState}from 'react'
import axios from 'axios'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle , AlertDialogDescription} from '@/components/ui/alert-dialog'
import {Link} from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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
    <div className='h-svh'>
        <Toaster position="top-center" richColors closeButton />
        <div className='container h-full flex flex-col py-4'>
            <div className='w-full pl-11 lg:pl-2'>
                <a href={logo.url} className="flex items-center gap-2">
                    <logo.icon size={30} className="max-h-10 text-blue-900" />
                    <span className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                    </span>
                </a>
            </div>
            <div className='flex items-center justify-center h-full'>
               <RegisterForm handlechange={handlechange} handleSubmit={handleSubmit}/>
            </div>
        </div>
        {open && <AlertMessage />}
    </div>
  )
}
