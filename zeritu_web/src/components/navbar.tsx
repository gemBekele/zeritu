"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Store", href: "/shop" },
  { name: "Events", href: "/events" },
  { name: "Articles", href: "/articles" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b py-4" : "bg-transparent py-6"
      )}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" className="relative w-24 h-8">
          <Image 
            src="/images/logo.png" 
            alt="Zeritu Kebede" 
            fill 
            sizes="96px"
            className="object-contain object-left brightness-0"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className=" text-sm   text-foreground/70 hover:text-primary transition-all duration-500 hover:tracking-[0.3em]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' ? (
                <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="hidden sm:flex rounded-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/orders">
                  <Button size="sm" variant="outline" className="hidden sm:flex rounded-full">
                    My Orders
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.name || user?.email}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => signOut()}
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : null}
          <Link href="/shop/checkout">
            <Button size="icon" variant="ghost" className="rounded-full relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
