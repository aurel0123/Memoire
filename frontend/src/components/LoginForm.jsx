import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useContext } from "react"
import PropTypes from 'prop-types'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import AuthContext from "@/context/AuthContext"

export default function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { loginUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginUser({ email, password })
      
      if (result.success) {
        toast.success("Connexion réussie")
      } else {
        toast.error("Erreur de connexion", {
          description: result.error || "Identifiants invalides",
        })
      }
    } catch (err) {
      toast.error("Erreur de connexion", {
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster position="top-center" richColors closeButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>
            Entrez votre email ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous n&apos;avez pas de compte?{" "}
              <a href="/inscription" className="underline underline-offset-4">
                Devenez Organisateur
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

LoginForm.propTypes = {
  className: PropTypes.string
}
