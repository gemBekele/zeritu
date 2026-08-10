"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { getImageUrl } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Books: "bg-primary/10 text-primary border-primary/20",
  Music: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Merch: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ limit: 4 });
  const products = data?.products || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-secondary">
        <Container>
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        </Container>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="section-subtitle text-base mb-4 block">
              Official store
            </span>
            <h2 className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tight text-foreground">
              Shop
            </h2>
          </div>
          <Link href="/shop">
            <Button
              variant="outline"
              className="rounded-full gap-2 border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary text-xs uppercase tracking-wider"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/shop`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-muted border border-border group-hover:border-primary/30 transition-all duration-500">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  <div
                    className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${
                      categoryColors[product.category] || "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {product.category}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                      <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {product.price} ETB
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
