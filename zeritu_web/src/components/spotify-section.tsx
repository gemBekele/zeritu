"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ExternalLink } from "lucide-react";

// Spotify embed URL — update with Zeritu's actual Spotify artist/album/playlist URI
const SPOTIFY_EMBED_URI = "https://open.spotify.com/artist/11KJHYJveIReJXfFkGMJn0";

const streamingLinks = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/11KJHYJveIReJXfFkGMJn0",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/artist/zeritu-kebede",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.335-2.22-1.16-.26-.514-.31-1.07-.16-1.63.2-.753.757-1.217 1.458-1.47.39-.14.797-.222 1.2-.3.46-.087.922-.17 1.364-.332.2-.074.37-.19.44-.397.028-.09.04-.186.04-.28V8.89c0-.18-.04-.337-.208-.433a.762.762 0 00-.347-.1c-.12-.013-.24 0-.36.023l-4.473.97c-.16.034-.32.076-.47.14-.19.082-.3.232-.33.432a1.52 1.52 0 00-.02.253v7.15c0 .37-.044.733-.196 1.073-.28.62-.776 1.01-1.426 1.193-.337.095-.684.148-1.034.166-.96.048-1.83-.31-2.264-1.16-.273-.536-.316-1.11-.152-1.69.21-.736.745-1.19 1.43-1.442.38-.14.778-.22 1.177-.3.46-.088.92-.17 1.36-.33.27-.1.47-.27.53-.56a.95.95 0 00.02-.2V7.63c0-.32.053-.626.2-.908.19-.36.497-.562.876-.654.166-.04.335-.07.504-.1l5.26-1.14c.345-.075.694-.13 1.046-.127.395.003.7.205.813.584.04.133.058.27.058.41v4.42z" />
      </svg>
    ),
  },
  {
    name: "YouTube Music",
    url: "https://www.youtube.com/@zeritu_kebede",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.582 6.186a2.506 2.506 0 00-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.504 2.504 0 001.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z" />
      </svg>
    ),
  },
];

export function SpotifySection() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle text-base mb-4 block">
            Listen now
          </span>
          <h2 className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tight text-white">
            Discography
          </h2>
        </motion.div>

        {/* Spotify Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden border border-border bg-muted/50 backdrop-blur-sm">
            <iframe
              style={{ borderRadius: "16px" }}
              src={`https://open.spotify.com/embed/artist/11KJHYJveIReJXfFkGMJn0?utm_source=generator&theme=0`}
              width="100%"
              height="452"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Zeritu Kebede on Spotify"
            />
          </div>

          {/* Fallback / Additional Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-6 font-light">
              Also available on
            </p>
            <div className="flex items-center justify-center gap-6">
              {streamingLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-light hidden sm:inline">
                    {link.name}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
