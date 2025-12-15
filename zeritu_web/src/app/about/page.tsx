import { Container } from "@/components/ui/container";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-50 pb-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] w-full rounded-3xl overflow-hidden">
            <Image
              src="/images/photo_2025-11-27_12-15-22.jpg"
              alt="Zeritu Kebede"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              About <span className="text-primary">Zeritu</span>
            </h1>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Zeritu Kebede is a multi-talented Ethiopian artist, singer, songwriter, social activist, and actress. Her journey in the arts has been marked by a deep commitment to authenticity and a passion for storytelling through music and film.
              </p>
              <p>
                With a career spanning over a decade, Zeritu has touched the hearts of many with her soulful voice and powerful lyrics. She is not just an entertainer but a voice for the voiceless, using her platform to advocate for social change and women's empowerment.
              </p>
              <p>
                Her music blends traditional Ethiopian sounds with modern influences, creating a unique genre that resonates with audiences both locally and internationally.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
