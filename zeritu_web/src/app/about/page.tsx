import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-50 pb-0">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] lg:h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/photo_2025-11-27_12-15-22.jpg"
                alt="Zeritu Kebede"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-primary font-medium tracking-widest text-sm uppercase">
                  Singer &middot; Songwriter &middot; Author &middot; Disciple
                </p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                  About <span className="text-primary">Zeritu</span>
                </h1>
              </div>
              <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Zeritu Kebede is a multi-award-winning Ethiopian singer and songwriter.
                  Born February 19, 1984 in Addis Ababa, she has spent over two decades shaping
                  Ethiopia&apos;s contemporary music landscape with a sound that defies genre —
                  blending pop, rock, funk, jazz, acoustic, and gospel into something
                  unmistakably her own.
                </p>
                <p>
                  From a record-breaking debut album to a nationwide tour and eight studio
                  albums, her music career has made her one of the most influential voices
                  in Ethiopian music.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
