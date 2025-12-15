import Link from "next/link";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">ZERITU</h3>
            <p className="text-muted-foreground max-w-xs">
              Official website of Zeritu Kebede. Music, books, events, and inspiring content for the community.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">NAVIGATION LINKS</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Store</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/articles" className="hover:text-primary transition-colors">Articles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">OTHERS</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy and policies</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms and conditions</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold">SUBSCRIBE TO OUR NEWSLETTER</h4>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent border-b border-muted-foreground/30 py-2 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-0 top-2 text-muted-foreground hover:text-primary transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <h5 className="font-semibold text-white">ADDRESS</h5>
              <p>+251-933-03-0116</p>
              <p>contact@zeritukebede.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; Zeritu Ltd 2024</p>
          <p>Copyright &copy; 2024 Zeritu Kebede. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
