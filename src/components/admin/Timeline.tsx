import React, { useState } from "react";
import {
  Phone, Mail, FileText, ArrowRight, Calendar, ArrowUpRight, Send,
} from "lucide-react";
import { useCrmData } from "../../contexts/CrmDataContext";
import type { TimelineEntry } from "../../contexts/CrmDataContext";

const TYPE_CONFIG: Record<TimelineEntry["type"], { icon: React.ElementType; color: string; label: string }> = {
  call: { icon: Phone, color: "bg-blue-100 text-blue-600 border-blue-300", label: "Appel" },
  email: { icon: Mail, color: "bg-indigo-100 text-indigo-600 border-indigo-300", label: "Email" },
  note: { icon: FileText, color: "bg-gray-100 text-gray-600 border-gray-300", label: "Note" },
  status_change: { icon: ArrowRight, color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Statut" },
  rdv: { icon: Calendar, color: "bg-blue-100 text-blue-600 border-blue-300", label: "RDV" },
  conversion: { icon: ArrowUpRight, color: "bg-green-100 text-green-600 border-green-300", label: "Conversion" },
};

interface TimelineProps {
  entityType: "prospect" | "client";
  entityId: string;
}

const Timeline: React.FC<TimelineProps> = ({ entityType, entityId }) => {
  const { getTimelineForEntity, addTimelineEntry } = useCrmData();
  const entries = getTimelineForEntity(entityType, entityId);

  const [noteType, setNoteType] = useState<"call" | "email" | "note">("note");
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    await addTimelineEntry({
      entityType,
      entityId,
      type: noteType,
      content: noteContent.trim(),
      author: "Admin",
    });
    setNoteContent("");
  };

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={handleAddNote} className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Ajouter :</span>
          {(["note", "call", "email"] as const).map((t) => {
            const cfg = TYPE_CONFIG[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setNoteType(t)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  noteType === t
                    ? cfg.color + " ring-1 ring-offset-1"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                <cfg.icon className="h-3 w-3" />
                {cfg.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Écrire une note..."
            rows={2}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
          />
          <button
            type="submit"
            disabled={!noteContent.trim()}
            className="flex items-center gap-1 self-end rounded-lg bg-rose-dark px-3 py-2 text-xs font-medium text-white transition hover:bg-[#a06868] disabled:opacity-40"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>

      {/* Timeline entries */}
      {entries.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-400">Aucune activité enregistrée</p>
      ) : (
        <div className="relative ml-4 border-l-2 border-gray-200 pl-6">
          {entries.map((entry) => {
            const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.note;
            const Icon = cfg.icon;
            return (
              <div key={entry.id} className="relative mb-4 last:mb-0">
                {/* Dot on timeline */}
                <div className={`absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white ${cfg.color}`}>
                  <Icon className="h-3 w-3" />
                </div>
                {/* Content */}
                <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100">
                  <div className="mb-1 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{entry.content}</p>
                  <p className="mt-1 text-[10px] text-gray-400">par {entry.author}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timeline;
