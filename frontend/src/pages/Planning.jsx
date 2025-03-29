import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Logo from '@/assets/images/logo.png'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Link} from 'react-router-dom'

const PlanningLicence = () => {
  const planningData = [
    {
      id: 1,
      jury: "Jury 1",
      salle: "Salle A",
      dateHeure: "12/06/2020 10:00",
      nomPrenoms: "DEGU 25011983",
      theme: "Thème 1",
      directeur: "Dr. XYZ\nGrade Directeur",
      president: "Dr. ABC\nGrade Président",
      examinateur: "Dr. DEF\nGrade Examinateur",
      rapporteur: "Dr. GHI\nGrade Rapporteur",
    },
    {
      id: 2,
      jury: "Jury 2",
      salle: "Salle B",
      dateHeure: "12/06/2020 11:00",
      nomPrenoms: "AGOS 01112001",
      theme: "Thème 2",
      directeur: "Dr. XYZ\nGrade Directeur",
      president: "Dr. ABC\nGrade Président",
      examinateur: "Dr. DEF\nGrade Examinateur",
      rapporteur: "Dr. GHI\nGrade Rapporteur",
    },
    // Ajouter d'autres entrées ici...
  ];
  return (
    <div className="p-6">
      <div className="mb-2 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Planning</h1>
        <span className="text-sm font-normal">
          Planning : <span className="font-semibold">Réseau et Génie Logiciel</span>
        </span>
      </div>
      <div className="justify-between items-center mb-6 hidden">
        <div className="w-20 h-10">
          <img src={Logo} alt="" />
        </div>
        <div className="text-center">
          <h1 className="uppercase font-bold text-2xl tracking-normal">
            Planning Soutenance Memoire
          </h1>
          <p className="text-destructive font-semibold">
            Licence Professionnel en Réseau et Génie Logiciel (RGL)
          </p>
        </div>
        <div className="text-sm text-right gap-3">
          <span>PMLS/06/2025</span>
          <p>
            Session de : <span className="font-semibold">Juin 2025</span>
          </p>
        </div>
      </div>
      <div>
      <div className="flex gap-6 items-center mb-6">
        <Input
          type = "search"
          placeholder = "Rechercher"
        />
        <Button asChild>
          <Link to ='./formsPlanning'> 
            Créer un planning 
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jury</TableHead>
            <TableHead>Salle</TableHead>
            <TableHead>Date et Heure</TableHead>
            <TableHead>Nom et Prénoms</TableHead>
            <TableHead>Thème</TableHead>
            <TableHead>Directeur</TableHead>
            <TableHead>Président</TableHead>
            <TableHead>Examinateur</TableHead>
            <TableHead>Rapporteur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planningData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.jury}</TableCell>
              <TableCell>{item.salle}</TableCell>
              <TableCell>{item.dateHeure}</TableCell>
              <TableCell>{item.nomPrenoms}</TableCell>
              <TableCell>{item.theme}</TableCell>
              <TableCell className="whitespace-pre-line">
                {item.directeur}
              </TableCell>
              <TableCell className="whitespace-pre-line">
                {item.president}
              </TableCell>
              <TableCell className="whitespace-pre-line">
                {item.examinateur}
              </TableCell>
              <TableCell className="whitespace-pre-line">
                {item.rapporteur}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <div className="gap-4 justify-end flex-col w-full text-right mt-10 hidden">
        <div className="">
          <p className="mb-2">Cotonou , le 12 juin 2025</p>
          <p className="mb-2">Le Directeur des etudes</p>
          <p className="text-bold">Dr Arsène VIGAN</p>
        </div>
      </div>
    </div>
  );
};

export default PlanningLicence;