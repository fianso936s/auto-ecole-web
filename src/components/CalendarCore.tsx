import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import type { CalendarEvent } from "../types/calendar";

interface CalendarCoreProps {
  events: CalendarEvent[];
  onCreate?: (start: Date, end: Date) => void;
  onMove?: (eventId: string, start: Date, end: Date) => void;
  onResize?: (eventId: string, start: Date, end: Date) => void;
  onSelect?: (eventId: string) => void;
  filters?: any;
  view?: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  editable?: boolean;
}

const CalendarCore: React.FC<CalendarCoreProps> = ({
  events,
  onCreate,
  onMove,
  onResize,
  onSelect,
  view = "timeGridWeek",
  editable = true,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  const handleDateSelect = (selectInfo: any) => {
    if (onCreate) {
      onCreate(selectInfo.start, selectInfo.end);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: any) => {
    if (onSelect) {
      onSelect(clickInfo.event.id);
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    if (onMove && dropInfo.event.start && dropInfo.event.end) {
      onMove(dropInfo.event.id, dropInfo.event.start, dropInfo.event.end);
    }
  };

  const handleEventResize = (resizeInfo: any) => {
    if (onResize && resizeInfo.event.start && resizeInfo.event.end) {
      onResize(
        resizeInfo.event.id,
        resizeInfo.event.start,
        resizeInfo.event.end
      );
    }
  };

  // Status-based colors
  const getEventColor = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "#10b981"; // Emerald-500
      case "COMPLETED":
        return "#6366f1"; // Indigo-500
      case "CANCELLED":
        return "#ef4444"; // Red-500
      case "NO_SHOW":
        return "#f59e0b"; // Amber-500
      case "PLANNED":
      default:
        return "#3b82f6"; // Blue-500
    }
  };

  const formattedEvents = events.map((event) => ({
    ...event,
    backgroundColor: event.colorHint || getEventColor(event.status),
    borderColor: "transparent",
    textColor: "#ffffff",
    extendedProps: {
      ...event,
    },
  }));

  return (
    <div className="calendar-container flex flex-col h-full w-full overflow-hidden rounded-xl border bg-white shadow-sm">
      <style>{`
        .fc { --fc-border-color: #f1f5f9; --fc-button-bg-color: #4f46e5; --fc-button-border-color: #4f46e5; --fc-button-hover-bg-color: #4338ca; --fc-button-active-bg-color: #3730a3; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
        .fc .fc-col-header-cell-cushion { padding: 8px 4px; font-size: 0.875rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
        .fc .fc-timegrid-slot-label-cushion { font-size: 0.75rem; color: #94a3b8; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
        .fc-event { border-radius: 6px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        @media (max-width: 768px) {
          .fc .fc-toolbar { flex-direction: column; gap: 8px; }
          .fc .fc-toolbar-title { font-size: 1rem; }
        }
      `}</style>
      <div className="flex-1 p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView={view}
          editable={editable}
          selectable={editable}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          locale={frLocale}
          events={formattedEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          height="100%"
          expandRows={true}
          stickyHeaderDates={true}
          handleWindowResize={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          nowIndicator={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: "08:00",
            endTime: "20:00",
          }}
          eventContent={(eventInfo) => {
            const { studentName, instructorName, status } =
              eventInfo.event.extendedProps;
            return (
              <div className="flex h-full flex-col overflow-hidden p-1.5 text-[11px] leading-tight text-white group cursor-pointer">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-bold truncate">
                    {eventInfo.timeText}
                  </span>
                  {status === "CONFIRMED" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  )}
                </div>
                <div className="font-semibold truncate">
                  {studentName || eventInfo.event.title}
                </div>
                {instructorName && (
                  <div className="opacity-80 truncate text-[10px] mt-0.5">
                    {instructorName}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CalendarCore;

