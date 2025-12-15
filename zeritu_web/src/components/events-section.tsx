"use client";

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function EventsSection() {
  return (
    <section id="events" className="py-24 bg-background">
      <Container>
        <div className="space-y-12">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
             <div className="lg:col-span-4">
               <h2 className="text-5xl md:text-7xl font-black text-secondary uppercase tracking-tighter leading-none">
                 Upcoming
                 <br />
                 <span className="text-primary">Event</span>
               </h2>
             </div>
             <div className="lg:col-span-8 pb-2">
                <p className="text-lg text-muted-foreground max-w-2xl">
                   Join Us For An Unforgettable Church Event That Promises To Be Monumental! <strong className="text-secondary">Experience The Joy Of Community And Faith</strong> As We Embark On This Incredible Journey Together.
                </p>
             </div>
          </div>

          <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden group shadow-2xl">
            <Image
              src="/images/upcoming.jpg"
              alt="Upcoming Event"
              fill
              className="object-contain bg-black/5"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row items-end justify-between gap-8">
               <div className="text-white">
                  <h3 className="text-3xl font-bold mb-2">Special Event</h3>
                  <p className="opacity-90">Check our social media for more details</p>
               </div>
               <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 px-8 min-w-[160px]">
                  Learn More
               </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
