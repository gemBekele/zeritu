"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events";
import { Event } from "@/lib/api/events";
import { Loader2, X } from "lucide-react";

interface EventFormProps {
  event?: Event;
  onClose: () => void;
}

export function EventForm({ event, onClose }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || "");
  const [time, setTime] = useState(event?.time || "");
  const [location, setLocation] = useState(event?.location || "");
  const [capacity, setCapacity] = useState(event?.capacity ?? 0);
  const [ticketPrice, setTicketPrice] = useState(event?.ticketPrice ?? 0);
  const [status, setStatus] = useState<"UPCOMING" | "PAST" | "CANCELLED">(event?.status || "UPCOMING");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image || null);
  const [error, setError] = useState("");

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data: any = {
        title,
        description,
        date,
        time,
        location,
        capacity,
        ticketPrice,
        status,
      };
      if (imageFile) {
        data.image = imageFile;
      }

      if (event) {
        await updateEvent.mutateAsync({ id: event.id, data });
      } else {
        if (!imageFile) {
          setError("Image is required");
          return;
        }
        await createEvent.mutateAsync(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save event");
    }
  };

  const isLoading = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {event ? "Edit Event" : "Add New Event"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Event venue or online link"
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Capacity</label>
              <input
                type="number"
                min="0"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ticket Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "UPCOMING" | "PAST" | "CANCELLED")}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="PAST">Past</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image {!event && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!event}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
            {imagePreview && (
              <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                event ? "Update Event" : "Create Event"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
