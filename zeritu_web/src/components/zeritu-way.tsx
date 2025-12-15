"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function ZerituWay() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] w-full">
             <div className="absolute -left-20 top-20 w-full h-full bg-primary/5 rounded-full blur-3xl" />
            <Image
              src="/images/uploaded_image_2_1763753872987.png"
              alt="Zeritu's Way"
              fill
              className="object-contain object-center"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black text-secondary uppercase tracking-tighter">
              Zeritu&apos;s Way
            </h2>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Lorem Ipsum Dolor Sit Amet Consectetur. Sed Sed Egestas Dolor Quis Nec. Vitae Ornare Sollicitudin Vestibulum Massa. Tempus Pellentesque Condimentum At A Mattis.
              </p>
              <p>
                Lacus Tellus Volutpat Libero Vitae Tempus Tellus. Tempor Quis Est Tellus Arcu Rhoncus Eu. Cras.
              </p>
            </div>

            <div className="pt-4">
               {/* Signature placeholder */}
               <div className="font-serif text-4xl text-primary italic mb-8">Zeritu K.</div>
               
               <Button size="lg" className="rounded-full bg-secondary text-white hover:bg-secondary/90 px-8">
                  Read More
                  <ArrowUpRight className="ml-2 w-4 h-4" />
               </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
