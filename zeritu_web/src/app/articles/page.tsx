"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/use-articles";
import { getImageUrl } from "@/lib/utils";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useArticles({ 
    published: 'true', 
    search: searchQuery || undefined,
    limit: 50 
  });
  
  const articles = data?.articles || [];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <Container>
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tighter">
                Articles
              </h1>
              <p className="text-muted-foreground mt-2">
                Explore our latest articles and insights
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="text-center py-24 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-xl">Loading articles...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-background rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group block"
                >
                  <div className="relative aspect-video overflow-hidden bg-secondary/5">
                    <Image
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                      Article
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    {article.publishedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(article.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-xl">
                {searchQuery ? "No articles found matching your search." : "No articles available yet."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Pagination Info */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {data.pagination.page} of {data.pagination.pages} pages
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}


