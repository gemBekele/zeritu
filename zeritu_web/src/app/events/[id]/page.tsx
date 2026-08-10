"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useEvent } from "@/hooks/use-events";
import { useRegisterForEvent } from "@/hooks/use-events";
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, Ticket, Users, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { data: event, isLoading, error } = useEvent(eventId);
  const registerForEvent = useRegisterForEvent();

  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regQuantity, setRegQuantity] = useState(1);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState<{ name: string; ticketRef: string } | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return notFound();
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    try {
      const result = await registerForEvent.mutateAsync({
        eventId,
        data: { name: regName, email: regEmail, phone: regPhone || undefined, quantity: regQuantity },
      });
      setRegSuccess({ name: result.name, ticketRef: result.ticketRef });
      setShowRegister(false);
    } catch (err: any) {
      setRegError(err.response?.data?.error || err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <Container>
        <Link href="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-secondary/5">
              <Image
                src={getImageUrl(event.image)}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-bold ${
                event.status === 'UPCOMING' ? 'bg-primary text-black' :
                event.status === 'PAST' ? 'bg-gray-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {event.status}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tighter leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{event.location}</span>
              </div>
              {event.capacity > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Capacity: {event.capacity}</span>
                </div>
              )}
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed">
              {event.description.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {event.status === 'UPCOMING' && (
              <div className="bg-secondary/5 border border-border rounded-2xl p-6 space-y-4 sticky top-28">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  Register for Event
                </h3>
                {event.ticketPrice > 0 && (
                  <p className="text-2xl font-black text-primary">{event.ticketPrice.toFixed(2)} ETB</p>
                )}
                {event.capacity > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.capacity} spots available</span>
                  </div>
                )}

                {!showRegister && !regSuccess ? (
                  <Button
                    className="w-full rounded-full"
                    size="lg"
                    onClick={() => setShowRegister(true)}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Get Tickets
                  </Button>
                ) : showRegister ? (
                  <form onSubmit={handleRegister} className="space-y-3">
                    {regError && (
                      <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-xs">{regError}</div>
                    )}
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Tickets</label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setRegQuantity(Math.max(1, regQuantity - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-secondary/5">-</button>
                        <span className="w-8 text-center font-medium text-sm">{regQuantity}</span>
                        <button type="button" onClick={() => setRegQuantity(Math.min(10, regQuantity + 1))} className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-secondary/5">+</button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => setShowRegister(false)}>Cancel</Button>
                      <Button type="submit" size="sm" className="flex-1 rounded-full" disabled={registerForEvent.isPending}>
                        {registerForEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                      </Button>
                    </div>
                  </form>
                ) : null}
              </div>
            )}

            {regSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  <h3 className="font-bold">Registration Confirmed!</h3>
                </div>
                <p className="text-sm text-green-700">Thank you, {regSuccess.name}!</p>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <p className="text-xs text-green-600 mb-1">Ticket Reference</p>
                  <p className="text-lg font-mono font-bold text-green-800">{regSuccess.ticketRef}</p>
                </div>
                <p className="text-xs text-green-600">Please save your ticket reference for entry.</p>
                <Button variant="outline" size="sm" className="w-full rounded-full" onClick={() => setRegSuccess(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            )}

            {event.capacity > 0 && (
              <div className="bg-secondary/5 border border-border rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Event Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-right">{event.location}</span>
                  </div>
                  {event.ticketPrice > 0 && (
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-muted-foreground">Ticket Price</span>
                      <span className="font-bold text-primary">{event.ticketPrice.toFixed(2)} ETB</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
