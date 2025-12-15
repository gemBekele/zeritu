"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookSectionProps {
  variant?: "dark" | "light";
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  titleImageSrc?: string;
  reverse?: boolean;
}

export function BookSection({
  variant = "dark",
  title,
  subtitle,
  description,
  imageSrc,
  titleImageSrc,
  reverse = false,
}: BookSectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden min-h-[600px] lg:min-h-[700px]",
        isDark ? "bg-secondary text-secondary-foreground" : "bg-[#f5f5f0] text-foreground"
      )}
    >
      {/* Background Image - positioned on the right */}
      <div className={cn(
        "absolute inset-0",
        reverse ? "scale-x-[-1]" : ""
      )}>
        <div className="absolute right-[-300] top-0 h-full w-full lg:w-[100%]">
          <Image
            src={imageSrc}
            alt="Book Cover"
            fill
            sizes="(max-width: 1024px) 100vw, 85vw"
            className="object-cover object-center"
            priority
          />
        </div>
        
        {/* Gradient overlays for blending */}
        <div className={cn(
          "absolute inset-0 z-10",
          isDark 
            ? "bg-gradient-to-r from-secondary via-secondary/95 via-30% to-secondary/10" 
            : "bg-gradient-to-r from-[#f5f5f0] via-[#f5f5f0]/95 via-20% to-[#f5f5f0]/1"
        )} />
        
        {/* Additional vertical gradient for depth */}
        <div className={cn(
          "absolute inset-0 z-10",
          isDark 
            ? "bg-gradient-to-t from-secondary/80 via-transparent to-secondary/40" 
            : "bg-gradient-to-t from-[#f5f5f0]/80 via-transparent to-[#f5f5f0]/40"
        )} />
        
        {/* Texture/Noise overlay (optional) */}
        <div className="absolute inset-0 z-10 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none" />
      </div>

      {/* Content */}
      <Container className="relative z-20 py-24 lg:py-32">
        <div className={cn(
          "max-w-xl",
          reverse ? "ml-auto text-right" : ""
        )}>
          <div className={cn("space-y-6", reverse && "flex flex-col items-end")}>
            <span className="text-primary font-light tracking-widest uppercase text-md inline-block">
              New Book
            </span>
            
            {titleImageSrc ? (
              <div className={cn(
                "relative h-32 w-full max-w-md",
                reverse && "scale-x-[-1]"
              )}>
                <Image 
                  src={titleImageSrc} 
                  alt={title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={cn(
                    "object-contain",
                    reverse ? "object-right" : "object-left"
                  )}
                />
              </div>
            ) : (
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                {title} <span className="text-primary">to</span> {subtitle}
              </h2>
            )}
            
            <p className={cn(
              "text-lg leading-relaxed max-w-lg",
              isDark ? "text-gray-400" : "text-muted-foreground"
            )}>
              {description}
            </p>

            <div className={cn("flex gap-4 pt-4", reverse && "flex-row-reverse")}>
              <Link href="/shop">
                <Button 
                  size="lg" 
                  className={cn(
                    "rounded-full px-8", 
                    isDark ? "bg-primary text-black hover:bg-white" : "bg-secondary text-white hover:bg-secondary/90"
                  )}
                >
                  Buy Now
                </Button>
              </Link>
              <Link href="/books">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className={cn(
                    "rounded-full w-12 h-12", 
                    isDark ? "border-white/20 hover:bg-white/10 text-white" : "border-black/20"
                  )}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
