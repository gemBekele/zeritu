"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Store", href: "/shop" },
  { name: "Events", href: "/events" },
  { name: "Articles", href: "/articles" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border py-4"
            : "bg-transparent py-6"
        )}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative w-24 h-8 z-50">
            <Image
              src="/images/logo.png"
              alt="Zeritu Kebede"
              fill
              sizes="96px"
              className="object-contain object-left brightness-0 invert transition-all duration-300"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-all duration-500 font-light"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === "ADMIN" ? (
                  <Link href="/dashboard">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden sm:flex rounded-full border-primary/30 text-primary hover:bg-primary hover:text-background text-xs"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/orders">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden sm:flex rounded-full border-primary/30 text-primary hover:bg-primary hover:text-background text-xs"
                    >
                      My Orders
                    </Button>
                  </Link>
                )}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {user?.name || user?.email}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full text-foreground/60 hover:text-primary"
                    onClick={() => signOut()}
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : null}

            {/* Cart */}
            <Link href="/shop/checkout">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full relative text-foreground/60 hover:text-primary"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-playfair tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Auth & Cart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-border w-48"
              >
                {isAuthenticated && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {user?.name || user?.email}
                    </span>
                    {user?.role === "ADMIN" ? (
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button size="sm" className="rounded-full bg-primary text-primary-foreground">
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/orders" onClick={() => setMobileOpen(false)}>
                        <Button size="sm" className="rounded-full bg-primary text-primary-foreground">
                          My Orders
                        </Button>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
