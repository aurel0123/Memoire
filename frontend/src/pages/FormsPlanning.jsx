import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Clock ,Trash2} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function FormsPlanning() {
  const [date, setDate] = React.useState() ; 
  const [time, setTime] = React.useState() ; 

  const [students, setStudents] = React.useState([{ name: "", theme: "" }]);

  const addStutenFiels = (e) => {
    e.preventDefault();
    setStudents([...students, { name: "", theme: "" }]);
  }

  const removeStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };
  return (
    <div>
      <div className="lg:flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-coloor-text ">
            Créer un planning
          </h1>
          <span className="text-sm font-normal text-slate-400">
            Gérer le planning de soutenance de mémoire
          </span>
        </div>
        <div className="mt-4">
          <Button>Enregistrer</Button>
        </div>
      </div>
      <div className=" mt-6">
        <form action="">
          <div className="flex w-full gap-x-4 space-y-4  flex-col lg:flex-row">
            {/* Premier élément plus grand */}
            <div className="flex flex-col  lg:flex-grow">
              <Card className="rounded-xs w-full">
                <CardHeader className="">
                  <CardTitle className="text-base uppercase font-medium text-coloor-text">
                    Informations de l'étudiant
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <Label htmlFor="theme" className=" font-light">
                        Thème
                      </Label>
                      <Input id="theme" placeholder="Entrer le theme" />
                    </div>
                    <h1 className="mb-4 font-semibold text-coloor-text text-base">
                      Information(s) de l'etudiant ou des etudiants associé(s) au theme
                    </h1>
                    {students.map((student, index) => {
                      return (
                        <div
                          key={index}
                          className="relative border p-4 rounded-lg"
                        >
                        
                          {students.length > 1 && (
                            <button
                              onClick={() => removeStudent(index)}
                              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="grid grid-cols-1 gap-4 pb-4">
                            <Label htmlFor="student" className=" font-light">
                              Etudiant(e) {index + 1}
                            </Label>
                            <Input
                              id="student"
                              placeholder="Entrer votre nom et prenom(s)"
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div className="mb-4">
                      <Button onClick={addStutenFiels}>
                        Ajouter un etudiant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xs w-full mt-4">
                <CardHeader>
                  <CardTitle className="text-base uppercase text-coloor-text font-semibold ">
                    Composition du jury
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3 ">Directeur</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="directeur"
                              className="text-coloor-text font-light"
                            >
                              Nom et Prénoms
                            </Label>
                            <Input id="directeur" placeholder="Dr. XYZ" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradeDirecteur">Grade</Label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent defaultOpen={false}>
                                <SelectItem value="docteur">Docteur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-medium mb-3">Président</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="directeur" className="font-light">
                              Nom et Prénoms
                            </Label>
                            <Input id="directeur" placeholder="Dr. XYZ" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradeDirecteur">Grade</Label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner le grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PR">Président</SelectItem>
                                <SelectItem value="EX">Examinateur</SelectItem>
                                <SelectItem value="RA">Rapporteur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-medium mb-3">Examinateur</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="Examinateur" className="font-light">
                              Nom et Prénoms
                            </Label>
                            <Input id="Examinateur" placeholder="Dr. XYZ" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradeDirecteur">Grade</Label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner le grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PR">Président</SelectItem>
                                <SelectItem value="EX">Examinateur</SelectItem>
                                <SelectItem value="RA">Rapporteur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-medium mb-3">Rapporteur </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="Rapporteur" className="font-light">
                              Nom et Prénoms
                            </Label>
                            <Input id="Rapporteur" placeholder="Dr. XYZ" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradeDirecteur">Grade</Label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner le grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PR">Président</SelectItem>
                                <SelectItem value="EX">Examinateur</SelectItem>
                                <SelectItem value="RA">Rapporteur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deuxième élément plus petit */}
            <Card className="lg:w-[32%] rounded-xs max-h-fit">
              <CardHeader>
                <CardTitle className="text-base uppercase font-medium text-coloor-text">
                  Détails de la soutenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date" className="font-light">
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full  text-left font-normal flex justify-between",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2 mt-4 flex-col ">
                  <Label htmlFor="time" className="font-light">
                    Heure
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {time ? (
                          time
                        ) : (
                          <span className="text-muted-foreground">
                            Sélectionner une heure
                          </span>
                        )}
                        <Clock className="w-5 h-5 " />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full border-none bg-transparent focus:outline-none text-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2 mt-4 flex-col">
                  <Label htmlFor="salle" className="font-light">
                    Selectionner une salle
                  </Label>
                  <Input id="salle" placeholder="Entrer la salle" />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
