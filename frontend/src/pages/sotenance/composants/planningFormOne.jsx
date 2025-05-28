import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PropTypes from 'prop-types'
import { useState , useEffect } from "react";

export default function PlanningFormOne({
  allGroupes, 
  setEtudiant1,
  setEtudiant2 ,
  enseignants , 
  setRoleJury, 
  directeurNom, 
  setDirecteurNom ,  
  setSelectedTheme
}) {
  const filterGroup = allGroupes.filter(
      (groupe)=> groupe.programmation === "est programmé"
    )
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [presidentId, setPresidentId] = useState("");
  const [examinateurId, setExaminateurId] = useState("");
  const [rapporteurId, setRapporteurId] = useState("");
  const [presidentType , setPresidentType] = useState("PRES");
  const [examinateurType , setExaminateurType] = useState("EXAM");
  const [rapporteurType , setRapporteurType] = useState("RAPP");
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    const groupe = filterGroup.find((g)=>g.theme === theme);
    setSelectedGroup(groupe);
    //setgroupId(groupe?.id || null);

    if (groupe?.etudiants?.length > 1) {
    // ✅ Cas binôme : deux étudiants
      setEtudiant1(groupe.etudiants[0].matricule);
      setEtudiant2(groupe.etudiants[1].matricule);
    } else if (groupe?.etudiant) {
      // ✅ Cas spécial si l'objet groupe a un seul étudiant sous `etudiant`
      setEtudiant1(groupe.etudiant.matricule);
      setEtudiant2('');
    } else {
      // ❌ Aucun étudiant
      setEtudiant1('');
      setEtudiant2('');
    }
  }

  const etudiantsList = selectedGroup
  ? Array.isArray(selectedGroup.etudiants)
    ? selectedGroup.etudiants
    : selectedGroup.etudiant
      ? [selectedGroup.etudiant]
      : []
  : [];

  useEffect(() => {
  setRoleJury( [
        { enseignant: presidentId, type: presidentType },
        { enseignant: rapporteurId, type: rapporteurType },
        { enseignant: examinateurId, type: examinateurType },
      ],
    );
  }, [ presidentId, examinateurId, rapporteurId,rapporteurType, presidentType, examinateurType , setRoleJury]);

  return (
    <div className="flex flex-col  lg:flex-grow">
      <Card className="rounded-xs w-full">
        <CardHeader className="">
          <CardTitle className="text-base uppercase font-medium text-coloor-text">
            Informations de l&apos;étudiant
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="theme" className=" font-light">
                Thème
              </Label>
              <Select onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le thème" />
                </SelectTrigger>
                <SelectContent>
                  {filterGroup.map((group) => {
                    return (
                      <SelectItem key={group.id} value={group.theme}>
                        {group.theme} - {group.programmation}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <h1 className="mb-4 font-semibold text-coloor-text text-base">
              Information(s) de l&apos;etudiant ou des etudiants associé(s) au
              theme
            </h1>
            <div className="relative border p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4 pb-4">
                <Label htmlFor="student" className=" font-light">
                  Etudiant(e) n°1
                </Label>
                <Input
                  id="student1"
                  value={
                    etudiantsList.length > 0
                      ? `${etudiantsList[0].nom} ${etudiantsList[0].prenom}`
                      : ''
                  }
                  disabled
                />
              </div>
            </div>
            <div className="relative border p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4 pb-4">
                <Label htmlFor="student" className=" font-light">
                  Etudiant(e) n°2
                </Label>
                <Input
                  id="student2"
                  value={
                    etudiantsList.length > 1
                      ? `${etudiantsList[1].nom} ${etudiantsList[1].prenom}`
                      : ''
                  }
                  disabled
                />
              </div>
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
                    <Input id="directeur" placeholder="Dr. XYZ" 
                      value={directeurNom}
                      onChange={(e) => setDirecteurNom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradeDirecteur">Grade</Label>
                    <Select  defaultValue="directeur">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Dircteur"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="directeur">Directeur</SelectItem>
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
                    <Select value={presidentId} onValueChange={setPresidentId} >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner le president" />
                      </SelectTrigger>
                      <SelectContent>
                        {enseignants.map((enseignant , index) => {
                          return (
                            <SelectItem key={index} value={enseignant.id.toString()}>
                              {enseignant.nom} - {enseignant.prenom}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradeDirecteur">Grade</Label>
                    <Select value={presidentType} onValueChange={setPresidentType}>
                      <SelectTrigger className="w-full" >
                        <SelectValue placeholder="President" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRES">Président</SelectItem>
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
                    <Select value={examinateurId} onValueChange={setExaminateurId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner l'Examinateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {enseignants.map((enseignant , index) => {
                          return (
                            <SelectItem key={index} value={enseignant.id.toString()}>
                              {enseignant.nom} - {enseignant.prenom}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradeDirecteur">Grade</Label>
                    <Select value={examinateurType} onValueChange={setExaminateurType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Examinateur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXAM">Examinateur</SelectItem>
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
                    <Select value={rapporteurId} onValueChange={setRapporteurId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner le Rapporteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {enseignants.map((enseignant , index) => {
                          return (
                            <SelectItem key={index} value={enseignant.id.toString()}>
                              {enseignant.nom} - {enseignant.prenom}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradeDirecteur">Grade</Label>
                    <Select value={rapporteurType} onValueChange={setRapporteurType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Rapporteur"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RAPP">Rapporteur</SelectItem>
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
  );
}

PlanningFormOne.propTypes = {
  allGroupes: PropTypes.array.isRequired,
  setEtudiant1: PropTypes.func.isRequired,
  setEtudiant2: PropTypes.func.isRequired,
  setgroupId : PropTypes.func.isRequired , 
  enseignants: PropTypes.array.isRequired ,
  setRoleJury: PropTypes.func.isRequired, 
  directeurNom: PropTypes.string.isRequired,
  setDirecteurNom: PropTypes.func.isRequired , 
  setSelectedTheme: PropTypes.func.isRequired
};
