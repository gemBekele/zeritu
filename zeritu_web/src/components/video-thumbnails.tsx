"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

const videos = [
  {
    id: 1,
    title: "ያድናል II Yadnal — ማጽናናትህ",
    videoId: "h6szR48vovo",
    link: "https://www.youtube.com/watch?v=h6szR48vovo",
  },
  {
    id: 2,
    title: "ጸጋው II Tsegaw — ማጽናናትህ",
    videoId: "Bb48egNJ6kM",
    link: "https://www.youtube.com/watch?v=Bb48egNJ6kM",
  },
  {
    id: 3,
    title: "በዛ II Bezza — ማጽናናትህ",
    videoId: "bcPyOwjA2_8",
    link: "https://www.youtube.com/watch?v=bcPyOwjA2_8",
  },
];

const VideoCard = ({ video }: { video: (typeof videos)[0] }) => (
  <a
    href={video.link}
    target="_blank"
    rel="noopener noreferrer"
    className="relative flex-shrink-0 w-[420px] md:w-[500px] aspect-video rounded-xl overflow-hidden group cursor-pointer mx-4"
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
      alt={video.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        target.src = "/images/album_cover.png";
      }}
    />

    {/* Hover overlay */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
      <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/40 transition-all duration-500">
        <Play className="w-6 h-6 fill-white text-white ml-1 opacity-90" />
      </div>
    </div>

    {/* Title */}
    <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
      <p className="font-playfair font-light tracking-wide text-base text-white/90 line-clamp-2">
        {video.title}
      </p>
    </div>
  </a>
);

export function VideoThumbnails() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      {/* Section Header */}
      <div className="mb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block space-y-4"
        >
          <span className="section-subtitle text-base block">
            Watch & listen
          </span>
          <h2 className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tight text-black">
            Music <span className="text-primary">Videos</span>
          </h2>
        </motion.div>
      </div>

      {/* Single Row Marquee */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            duration: 60,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...videos, ...videos, ...videos, ...videos, ...videos, ...videos].map(
            (video, idx) => (
              <VideoCard key={`row-${idx}`} video={video} />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
