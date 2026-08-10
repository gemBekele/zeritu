"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEvents } from "@/hooks/use-events";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Ticket } from "lucide-react";

export function EventsSection() {
  const { data, isLoading } = useEvents({ status: "UPCOMING", limit: 6 });
  const pastData = useEvents({ status: "PAST", limit: 4 });

  const upcomingEvents = data?.events || [];
  const pastEvents = pastData.data?.events || [];

  return (
    <section id="events" className="py-24 md:py-32 bg-background relative grain-overlay">
      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle text-base mb-4 block">
            Join us
          </span>
          <h2 className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tight text-foreground">
            Upcoming <span className="text-primary">Events</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Link href={`/events`} className="block">
                  {/* Portrait image */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border group-hover:border-primary/30 transition-all duration-500">
                    <Image
                      src={getImageUrl(event.image)}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Date badge */}
                    <div className="absolute top-4 left-4 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 text-center">
                      <p className="text-lg font-bold leading-none text-primary">
                        {format(new Date(event.date), "dd")}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-white/70 leading-none mt-1">
                        {format(new Date(event.date), "MMM")}
                      </p>
                    </div>

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                      <h3 className="text-2xl font-sans font-bold text-white leading-snug line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/70">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {format(new Date(event.date), "MMMM d, yyyy")}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {event.time}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {event.location}
                        </span>
                      </div>
                      {event.ticketPrice > 0 && (
                        <span className="flex items-center gap-1.5 text-primary text-sm">
                          <Ticket className="w-4 h-4" />
                          {event.ticketPrice} ETB
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Learn more */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      Learn more
                    </span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16 border border-border rounded-2xl"
          >
            <p className="text-muted-foreground font-light text-lg">
              No upcoming events at the moment.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Follow us on social media for announcements.
            </p>
          </motion.div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="mt-20">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8 text-center"
            >
              Past Events
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-border">
                    <Image
                      src={getImageUrl(event.image)}
                      alt={event.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-foreground/80">
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(event.date), "MMMM d, yyyy")}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
