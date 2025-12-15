import { Hero } from "@/components/hero";
import { BookSection } from "@/components/book-section";
import { VideoThumbnails } from "@/components/video-thumbnails";
import { MusicPlayer } from "@/components/music-player";
import { VideoGallery } from "@/components/video-gallery";
import { EventsSection } from "@/components/events-section";
import { ArticlesSection } from "@/components/articles-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <BookSection 
        variant="dark"
        title="From Childhood"
        subtitle="Childhood"
        description="A journey through childhood memories, faith, and the stories that shape us. Discover the inspiration behind Zeritu's latest work.A journey through childhood memories, faith, and the stories that shape us. Discover the inspiration behind Zeritu's latest work."
        imageSrc="/images/multi_book_8.png"
        titleImageSrc="/images/book - Asset 10@4x.png"
      />
      
      <VideoThumbnails />
      
      <MusicPlayer />
      
      {/* <BookSection 
        variant="light"
        title="From Childhood"
        subtitle="Childhood"
        description="A journey through childhood memories, faith, and the stories that shape us. Discover the inspiration behind Zeritu's latest work."
        imageSrc="/images/multi_book_8.png"
        titleImageSrc="/images/book_title.jpg"
        reverse
      /> */}
      
      {/* <VideoGallery /> */}
      
      <EventsSection />
      
      <ArticlesSection />
    </div>
  );
}
