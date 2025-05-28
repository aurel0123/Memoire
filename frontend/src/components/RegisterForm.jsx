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
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'

export default function RegisterForm({
  className,handlechange,handleSubmit,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">S&apos;enregistrer</CardTitle>
          <CardDescription>
            Entrer vos informatiosn pour vous enregistrez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid lg:grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    type="nom"
                    name ="nom"
                    placeholder="Lawson"
                    required
                    onChange={handlechange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prenom">Prénom(s)</Label>
                  <Input
                    id="prenom"
                    type="prenom"
                    placeholder="Jean-Pierre"
                    name="prenom"
                    onChange ={handlechange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  onChange={handlechange}
                />
              </div>
              <Button type="submit" className="w-full">
                S&apos;enregistrer
              </Button>
              
            </div>
            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte?{"  "}
              <Link to="/connexion" className="underline underline-offset-4">
                Connexion
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
RegisterForm.propTypes = {
  className: PropTypes.string,
  handlechange: PropTypes.func,
  handleSubmit: PropTypes.func,
}
