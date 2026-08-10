"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useArticles } from "@/hooks/use-articles";
import { getImageUrl } from "@/lib/utils";
import { format } from "date-fns";

export function ArticlesSection() {
  const { data, isLoading } = useArticles({ published: "true", limit: 3 });
  const articles = data?.articles || [];

  return (
    <section id="articles" className="py-24 md:py-32 bg-white relative">
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
              Stories & insights
            </span>
            <h2 className="text-5xl md:text-7xl font-sans font-bold uppercase tracking-tight text-black">
              Articles
            </h2>
          </div>
          <Link href="/articles">
            <Button
              variant="outline"
              className="rounded-full gap-2 bg-white border-black/30 text-black hover:border-primary hover:text-primary text-xs uppercase tracking-wider"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/articles/${article.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-gray-200 group-hover:border-primary/30 transition-all duration-500">
                    <Image
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-3">
                    {article.createdAt && (
                      <p className="text-xs uppercase tracking-widest text-black/50 font-light">
                        {format(new Date(article.createdAt), "MMMM d, yyyy")}
                      </p>
                    )}
                    <h3 className="text-xl font-sans font-semibold leading-tight text-black group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-black/60 line-clamp-2 font-light">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-gray-200 rounded-2xl">
            <p className="text-black/60 font-light text-lg">
              No articles available yet.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
