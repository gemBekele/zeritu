"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const videos = [
  { 
    id: 1, 
    title: "ያድናል II Yadnal", 
    videoId: "2T0rXJ-gB2Q", 
    link: "https://www.youtube.com/watch?v=2T0rXJ-gB2Q" 
  },
  { 
    id: 2, 
    title: "ጸጋው II Tsegaw", 
    videoId: "2T0rXJ-gB2Q", // Placeholder ID - Replace with actual
    link: "https://www.youtube.com/@zeritu_kebede" 
  },
  { 
    id: 3, 
    title: "በዛ II Bezza", 
    videoId: "2T0rXJ-gB2Q", // Placeholder ID - Replace with actual
    link: "https://www.youtube.com/@zeritu_kebede" 
  },
  { 
    id: 4, 
    title: "ና ጌታ ሆይ II Na Geta Hoy", 
    videoId: "2T0rXJ-gB2Q", // Placeholder ID - Replace with actual
    link: "https://www.youtube.com/@zeritu_kebede" 
  },
  { 
    id: 5, 
    title: "ማጽናናትህ II Matsnanatih", 
    videoId: "2T0rXJ-gB2Q", // Placeholder ID - Replace with actual
    link: "https://www.youtube.com/@zeritu_kebede" 
  },
  { 
    id: 6, 
    title: "ኮከቡ ኢየሱስ ነው II Kokebu Iyesus New", 
    videoId: "2T0rXJ-gB2Q", // Placeholder ID - Replace with actual
    link: "https://www.youtube.com/@zeritu_kebede" 
  },
];

const VideoCard = ({ video }: { video: typeof videos[0] }) => (
  <a 
    href={video.link}
    target="_blank"
    rel="noopener noreferrer"
    className="relative aspect-video w-[300px] md:w-[400px] flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer border border-white/10 mx-4"
  >
    <Image
      src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
      alt={video.title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
        <Play className="w-5 h-5 fill-black text-black ml-1" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
      <p className="font-medium text-sm text-white line-clamp-1">{video.title}</p>
    </div>
  </a>
);

export function VideoGallery() {
  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      
      <div className="mb-16 text-center relative z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block"
        >
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4">
            VISUAL JOURNEY
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
        </motion.div>
      </div>

      <div className="space-y-8 relative z-0">
        {/* First Row - Moving Left */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 40, 
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            {[...videos, ...videos].map((video, idx) => (
              <VideoCard key={`row1-${idx}`} video={video} />
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Right */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ 
              duration: 45, 
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            {[...videos, ...videos].map((video, idx) => (
              <VideoCard key={`row2-${idx}`} video={video} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

