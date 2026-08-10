"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { encodeImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";

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
      className={
        isDark
          ? "relative overflow-hidden min-h-[600px] lg:min-h-[700px] bg-black text-foreground"
          : "relative overflow-hidden min-h-[600px] lg:min-h-[700px] bg-cream text-background"
      }
    >
      {/* Background Image — covers right portion */}
      <div className={reverse ? "absolute inset-0 scale-x-[-1]" : "absolute inset-0"}>
        <div className="absolute right-0 top-0 h-full w-full lg:w-[68%] lg:ml-auto">
          <Image
            src={encodeImageUrl(imageSrc)}
            alt="Book Cover"
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Content */}
      <Container className="relative z-20 py-24 lg:py-32">
        <div className={reverse ? "max-w-xl ml-auto text-right" : "max-w-xl"}>
          <div className={reverse ? "space-y-6 flex flex-col items-end" : "space-y-6"}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-subtitle text-base inline-block"
            >
              New Book
            </motion.span>

            {titleImageSrc ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={
                  reverse
                    ? "relative h-32 w-full max-w-md scale-x-[-1]"
                    : "relative h-32 w-full max-w-md"
                }
              >
                <Image
                  src={encodeImageUrl(titleImageSrc)}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={
                    reverse
                      ? "object-contain object-right"
                      : "object-contain object-left"
                  }
                  unoptimized
                />
              </motion.div>
            ) : (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-sans font-bold leading-tight"
              >
                {title}{" "}
                <span className="text-primary italic">to</span> {subtitle}
              </motion.h2>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={
                isDark
                  ? "text-lg leading-relaxed max-w-lg text-foreground/50 font-light"
                  : "text-lg leading-relaxed max-w-lg text-background/60 font-light"
              }
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={reverse ? "flex gap-4 pt-4 flex-row-reverse" : "flex gap-4 pt-4"}
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className={
                    isDark
                      ? "rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary-light transition-all duration-500 uppercase text-xs tracking-wider"
                      : "rounded-full px-8 bg-background text-foreground hover:bg-background/90 transition-all duration-500 uppercase text-xs tracking-wider"
                  }
                >
                  Buy Now
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  size="icon"
                  variant="outline"
                  className={
                    isDark
                      ? "rounded-full w-12 h-12 border-foreground/20 hover:bg-foreground/10 text-foreground"
                      : "rounded-full w-12 h-12 border-background/20 hover:bg-background/10 text-background"
                  }
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
