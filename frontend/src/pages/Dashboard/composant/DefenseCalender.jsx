import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Données fictives
const events = [
  { date: new Date(2025, 4, 5), count: 3 },
  { date: new Date(2025, 4, 10), count: 2 },
  { date: new Date(2025, 4, 12), count: 1 },
  { date: new Date(2025, 4, 15), count: 4 },
  { date: new Date(2025, 4, 20), count: 2 },
];

export function DefenseCalendar() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");

  const hasEvents = (day) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const getEventCount = (day) => {
    const event = events.find(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
    return event ? event.count : 0;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Calendrier des soutenances</CardTitle>
        <Select value={view} onValueChange={(value) => setView(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Vue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Journée</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-3 pointer-events-auto w-full"
          classNames={{
            months: "flex flex-col w-full",
            table: "w-full table-fixed",
            head_cell: "text-muted-foreground w-full text-center text-[0.8rem]",
            cell: "flex-1",
          }}
          modifiers={{
            hasEvents: (date) => hasEvents(date),
          }}
          modifiersStyles={{
            hasEvents: {
              fontWeight: 'bold',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '5px',
                height: '5px',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
              }
            }
          }}
          components={{
            DayContent: ({ date }) => (
              <div className="relative w-full h-full flex items-center justify-center">
                <span>{date.getDate()}</span>
                {hasEvents(date) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1.5 flex justify-center items-center">
                    <span className="bg-blue-500 text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {getEventCount(date)}
                    </span>
                  </div>
                )}
              </div>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
}
