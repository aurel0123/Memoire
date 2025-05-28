import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import PropTypes from 'prop-types';

export default function PlanningFormTwo({
  date, setDate, time, setTime, salle, setSalle 
}) {

  return (
    <>
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
                <Button variant="outline" className="w-full justify-between">
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
            <Input 
              id="salle"
              placeholder="Entrer la salle"
              value={salle}
              onChange={(e) => setSalle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

PlanningFormTwo.propTypes = {
  date: PropTypes.instanceOf(Date),
  setDate: PropTypes.func.isRequired,
  time: PropTypes.string,
  setTime: PropTypes.func.isRequired,
  salle: PropTypes.string,
  setSalle: PropTypes.func.isRequired
}