"use client";

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";

export default function EventsPage() {
  const { data: upcomingData, isLoading: upcomingLoading } = useEvents({ status: 'UPCOMING' });
  const { data: pastData, isLoading: pastLoading } = useEvents({ status: 'PAST' });
  
  const upcomingEvents = upcomingData?.events || [];
  const pastEvents = pastData?.events || [];
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-secondary uppercase tracking-tighter">
              Events
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us for upcoming events and relive memories from past gatherings. Stay connected with our community.
            </p>
          </div>

          {/* Upcoming Events */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
              Upcoming <span className="text-primary">Events</span>
            </h2>
            
            {upcomingLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Loading upcoming events...</p>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-background rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-primary text-black text-xs px-3 py-1 rounded-full font-bold">
                        Upcoming
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                      <Button className="w-full rounded-full bg-secondary text-white hover:bg-secondary/90">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No upcoming events scheduled.</p>
              </div>
            )}
          </section>

          {/* Past Events */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
              Past <span className="text-primary">Events</span>
            </h2>
            
            {pastLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Loading past events...</p>
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-background rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow group opacity-75"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale"
                      />
                      <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        Past
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No past events available.</p>
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}

