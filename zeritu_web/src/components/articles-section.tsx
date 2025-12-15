"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/use-articles";
import { getImageUrl } from "@/lib/utils";

export function ArticlesSection() {
  const { data, isLoading } = useArticles({ published: 'true', limit: 6 });
  const articles = data?.articles || [];
  return (
    <section id="articles" className="py-24 bg-accent/30">
      <Container>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter">Articles</h2>
          <Link href="/articles">
            <Button variant="outline" className="rounded-full gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.id}`}
                className="bg-background rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow group block"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={getImageUrl(article.image)}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                     Article
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No articles available yet.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
