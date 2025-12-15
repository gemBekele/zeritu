"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

const videos = [
  { 
    id: 1, 
    title: "ያድናል II Yadnal - ማጽናናትህ የመዝሙርና የምስክርነት ምሽት", 
    videoId: "h6szR48vovo",
    link: "https://www.youtube.com/watch?v=h6szR48vovo" 
  },
  { 
    id: 2, 
    title: "ጸጋው II Tsegaw - ማጽናናትህ የመዝሙርና የምስክርነት ምሽት", 
    videoId: "Bb48egNJ6kM",
    link: "https://www.youtube.com/watch?v=Bb48egNJ6kM" 
  },
  { 
    id: 3, 
    title: "በዛ II Bezza - ማጽናናትህ የመዝሙርና የምስክርነት ምሽት", 
    videoId: "bcPyOwjA2_8",
    link: "https://www.youtube.com/watch?v=bcPyOwjA2_8" 
  },
  { 
    id: 4, 
    title: "ና ጌታ ሆይ II Na Geta Hoy - ማጽናናትህ የመዝሙርና የምስክርነት ምሽት", 
    videoId: "h6szR48vovo",
    link: "https://www.youtube.com/watch?v=h6szR48vovo" 
  },
  { 
    id: 5, 
    title: "ማጽናናትህ II Matsnanatih - የመዝሙርና የምስክርነት ምሽት", 
    videoId: "Bb48egNJ6kM",
    link: "https://www.youtube.com/watch?v=Bb48egNJ6kM" 
  },
  { 
    id: 6, 
    title: "ኮከቡ ኢየሱስ ነው II Kokebu Iyesus New - ማጽናናትህ የመዝሙርና የምስክርነት ምሽት", 
    videoId: "bcPyOwjA2_8",
    link: "https://www.youtube.com/watch?v=bcPyOwjA2_8" 
  },
];

const VideoCard = ({ video }: { video: typeof videos[0] }) => (
  <a 
    href={video.link}
    target="_blank"
    rel="noopener noreferrer"
    className="relative flex-shrink-0 w-[500px] aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 mx-6"
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
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
        <Play className="w-6 h-6 fill-white text-white ml-1 opacity-90" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <p className="font-cronde font-light tracking-wide text-lg text-white/90 line-clamp-2">{video.title}</p>
    </div>
  </a>
);

export function VideoThumbnails() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="mb-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block space-y-4"
        >
          <h2 className="text-5xl md:text-7xl font-cronde font-light text-secondary tracking-tight leading-none">
            Listen <span className="italic text-primary">Songs</span>
          </h2>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </motion.div>
      </div>

      <div className="space-y-12">
        {/* First Row - Moving Left - Slower */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-20%"] }}
            transition={{ 
              duration: 80, 
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            {[...videos, ...videos, ...videos].map((video, idx) => (
              <VideoCard key={`row1-${idx}`} video={video} />
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Right - Slower */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ 
              duration: 90, 
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            {[...videos, ...videos, ...videos].map((video, idx) => (
              <VideoCard key={`row2-${idx}`} video={video} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


