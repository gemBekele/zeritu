import { Hero } from "@/components/hero";
import { BookSection } from "@/components/book-section";
import { SpotifySection } from "@/components/spotify-section";
import { VideoThumbnails } from "@/components/video-thumbnails";
import { EventsSection } from "@/components/events-section";
import { FeaturedProducts } from "@/components/featured-products";
import { ArticlesSection } from "@/components/articles-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <BookSection
        variant="dark"
        title="From Childhood"
        subtitle="Childhood"
        description="A journey through childhood memories, faith, and the stories that shape us. Discover the inspiration behind Zeritu's latest work — a deeply personal exploration of identity, grace, and the power of storytelling."
        imageSrc="/images/multi_book_8.png"
        titleImageSrc="/images/book - Asset 10@4x.png"
      />

      <SpotifySection />

      <ArticlesSection />

      <EventsSection />

      <FeaturedProducts />

      <VideoThumbnails />

      <ContactSection />
    </div>
  );
}
