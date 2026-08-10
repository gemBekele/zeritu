"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0 z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* Readability gradient — darkens toward the bottom-left where the text sits */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/30 to-black/20" />
      </div>

      {/* Main Content — left bottom */}
      <div className="relative z-10 flex flex-col items-start justify-end text-left flex-1 pl-16 pr-6 pb-48 sm:pb-52 md:pl-24 md:pr-12 lg:pl-32 lg:pr-20 w-full">
        {/* Main Name — Bold Sans-Serif Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-white"
        >
          Zeritu
          <br />
          <span className="text-white">Kebede</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] text-foreground/80 font-light mt-8"
        >
          Singer &ensp;·&ensp; mother &ensp;·&ensp; Author &ensp;·&ensp; Disciple
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12"
        >
          <a
            href="https://open.spotify.com/artist/11KJHYJveIReJXfFkGMJn0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="rounded-full px-10 bg-primary text-primary-foreground hover:bg-primary-light transition-all duration-500 text-sm tracking-wider uppercase font-medium"
            >
              Listen on Spotify
            </Button>
          </a>
          <Link href="/shop">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 border-foreground/20 text-foreground/80 hover:border-primary hover:text-primary transition-all duration-500 text-sm tracking-wider uppercase font-medium"
            >
              Explore Store
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-light">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
