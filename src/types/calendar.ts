import type { EventInput } from "@fullcalendar/core";

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  status?: "PLANNED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  instructorName?: string;
  studentName?: string;
  location?: string;
  vehicleName?: string;
  colorHint?: string;
}

