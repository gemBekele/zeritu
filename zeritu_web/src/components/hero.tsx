"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Music } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-background">
      {/* Animated Background Elements - Refined for Luxury/Subtlety */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating orb 1 - Gold/Primary - Very slow, breathing motion */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-[120px]"
          style={{ top: '-20%', left: '-10%' }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Floating orb 2 - Dark/Secondary - Subtle depth */}
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-tl from-secondary/5 to-transparent blur-[100px]"
          style={{ bottom: '-30%', right: '-20%' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Elegant light sweep */}
        <motion.div
          className="absolute w-[150%] h-[300px] bg-gradient-to-r from-transparent via-primary/5 to-transparent rotate-[-15deg]"
          style={{ top: '40%', left: '-25%' }}
          animate={{
            x: ['-10%', '10%'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Container className="grid lg:grid-cols-2 gap-0 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-9xl text-secondary leading-none font-cronde tracking-tight">
                Zeritu
                <br />
                <span className="text-primary">Kebede</span>
              </h1>
            </motion.div>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed font-light tracking-wide">
              Singer, song writer, mother, disciple.
            </p>
          </div>

          <div className="flex items-center gap-6">
             <a 
               href="https://www.youtube.com/@zeritu_kebede" 
               target="_blank" 
               rel="noopener noreferrer"
               className="relative group cursor-pointer"
             >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-700" />
                <Button size="lg" className="rounded-full h-20 w-20 p-0 relative z-10 border border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary text-primary hover:text-white transition-all duration-500 shadow-xl group-hover:scale-105">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </Button>
             </a>
             <div className="flex flex-col space-y-1">
                <span className="font-medium text-lg tracking-wide">Latest Project</span>
                <span className="text-sm text-muted-foreground font-light">Watch on YouTube</span>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] lg:h-[700px] w-full"
        >
          <Image
            src={encodeURI("/images/aaa.png")}
            // src="/images/Background copy 2-min.png"
            alt="Zeritu Kebede Portrait"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center drop-shadow-2xl"
            priority
            unoptimized
          />
        </motion.div>
      </Container>
    </section>
  );
}
