"use client";

import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useArticle } from "@/hooks/use-articles";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const { data: article, isLoading, error } = useArticle(articleId);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not published";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="min-h-screen pt-24 pb-16 bg-background">
      <Container className="max-w-4xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary uppercase tracking-tighter leading-tight">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author.name || article.author.email}</span>
                  </div>
                )}
                {article.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                )}
                {!article.published && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-secondary/5">
              <Image
                src={getImageUrl(article.image)}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:mb-6 prose-p:leading-relaxed prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-black prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-8 mt-12">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {article.author && (
                  <p>
                    Written by <span className="font-medium text-foreground">{article.author.name || article.author.email}</span>
                  </p>
                )}
              </div>
              <Link href="/articles">
                <Button variant="outline" className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
