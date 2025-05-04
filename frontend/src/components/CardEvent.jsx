import { cn } from '@/lib/utils';
import { Edit, Trash, UserPlus, MoreHorizontal, Eye } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import PropTypes from 'prop-types';

export default function CardEvent({
  className,
  nom,
  status,
  photo,
  prepareDelete,
  handleEditEvent,
  handleCandidats , 
  handleAddCandidat
}) {
  const statusColors = {
    "en cours": "bg-green-500",
    "terminé": "bg-red-500",
    "à venir": "bg-blue-500"
  };

  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between rounded-xl border border-neutral-200 bg-white transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className
      )}
    >
      <div className="relative h-48 w-full">
        <Badge className={`absolute bottom-2 left-2 z-10 ${statusColors[status] || "bg-primary"}`}>
          {status}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 bg-black/30 hover:bg-black/50 rounded-full">
              <MoreHorizontal size={18} className="text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleAddCandidat}>
              <UserPlus size={16} /> Ajouter des candidats
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleCandidats}>
              <Eye size={16} /> Afficher l&apos;évènement
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleEditEvent}>
              <Edit size={16} /> Modifier l&apos;événement
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-500 cursor-pointer" 
              onClick={prepareDelete}
            >
              <Trash size={16} /> Supprimer l&apos;événement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="w-full h-full overflow-hidden rounded-t-xl">
          <img
            className="w-full h-full object-cover transition-all duration-500 group-hover/bento:scale-110 group-hover/bento:brightness-110"
            src={photo}
            alt={nom}
          />
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover/bento:opacity-25 rounded-t-xl cursor-pointer"></div>
        </div>
      </div>
      
      <div className="transition duration-200 p-2 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="font-sans font-bold text-neutral-600 dark:text-neutral-200 text-lg line-clamp-1">
            {nom}
          </h3>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button className={cn("rounded-xl cursor-pointer flex-1")}  size="sm" variant="default" onClick={handleAddCandidat}>
            <UserPlus size={16} className="mr-2" /> Ajouter des candidats
          </Button>
          {/* <Button size="sm" variant="outline" onClick={handleEditEvent}>
            <Edit size={16} />
          </Button> */}
          <Button size="sm" variant="outline" onClick={handleCandidats} className={cn("rounded-xl cursor-pointer")}>
            <Eye size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

CardEvent.propTypes = {
  className: PropTypes.string,
  nom: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  prepareDelete: PropTypes.func.isRequired,
  handleEditEvent: PropTypes.func.isRequired,
  handleCandidats: PropTypes.func.isRequired
};