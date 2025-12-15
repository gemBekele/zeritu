"use client";

import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Share2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tracks = [
  { id: 1, title: "Matsnanatih", artist: "Zeritu Kebede", duration: "8:12", plays: "999,999" },
  { id: 2, title: "Na Geta Hoy", artist: "Zeritu Kebede", duration: "6:53", plays: "854,221" },
  { id: 3, title: "Ejen yizeh Miragn", artist: "Zeritu Kebede", duration: "7:32", plays: "723,110" },
  { id: 4, title: "Bezza", artist: "Zeritu Kebede", duration: "7:25", plays: "654,889" },
  { id: 5, title: "Tsegaw", artist: "Zeritu Kebede", duration: "9:15", plays: "543,210" },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
       {/* Background glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Now Playing Card */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden group shadow-2xl border border-white/10">
              <Image
                src="/images/album_cover.png"
                alt="Album Art"
                fill
                sizes="(max-width: 1024px) 100vw, 41.666667vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
                <div>
                  <h3 className="text-3xl font-bold">Live Album</h3>
                  <p className="text-primary font-medium">Zeritu Kebede</p>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs text-gray-400">999,999 Monthly Listeners</span>
                   <div className="flex gap-2">
                      <Button size="sm" className="rounded-full bg-primary text-black hover:bg-white">Buy Now</Button>
                      <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0">
                         <Share2 className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls & Playlist */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-2">
               <h2 className="text-5xl font-black text-white/10 uppercase tracking-tighter select-none">
                  Discography
               </h2>
               <h3 className="text-3xl font-bold text-primary">Top Tracks</h3>
            </div>

            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className={cn(
                     "flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer group",
                     index === currentTrack ? "bg-white/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
                  )}
                  onClick={() => setCurrentTrack(index)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-gray-500 w-6">#{track.id}</span>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                       <Image src="/images/album_cover.png" alt="Thumb" fill sizes="48px" className="object-cover" />
                       {index === currentTrack && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                             <div className="w-1 h-4 bg-primary mx-[1px] animate-pulse" />
                             <div className="w-1 h-6 bg-primary mx-[1px] animate-pulse delay-75" />
                             <div className="w-1 h-3 bg-primary mx-[1px] animate-pulse delay-150" />
                          </div>
                       )}
                    </div>
                    <div>
                      <h4 className={cn("font-medium", index === currentTrack ? "text-primary" : "text-white")}>{track.title}</h4>
                      <p className="text-xs text-gray-400">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-gray-400">
                    <span className="hidden md:block">{track.plays}</span>
                    <span>{track.duration}</span>
                    <Button size="icon" variant="ghost" className="hover:text-primary">
                       <Heart className={cn("w-4 h-4", index === currentTrack && "fill-primary text-primary")} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Controls */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
               <div className="flex items-center justify-center gap-8 mb-6">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Shuffle className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-primary"><SkipBack className="w-6 h-6" /></Button>
                  <Button 
                     size="icon" 
                     className="w-14 h-14 rounded-full bg-primary text-black hover:bg-white hover:scale-105 transition-all"
                     onClick={() => setIsPlaying(!isPlaying)}
                  >
                     {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-primary"><SkipForward className="w-6 h-6" /></Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Repeat className="w-5 h-5" /></Button>
               </div>
               
               <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <span>0:51</span>
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
                     <div className="h-full w-1/3 bg-primary group-hover:bg-white transition-colors relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                     </div>
                  </div>
                  <span>3:45</span>
               </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
