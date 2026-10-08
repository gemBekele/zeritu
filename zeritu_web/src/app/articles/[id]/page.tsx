"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useArticle, useArticleComments, useAddComment, useDeleteComment, useLikeStatus, useToggleLike, useIncrementView } from "@/hooks/use-articles";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, ArrowLeft, Calendar, User, Heart, MessageCircle, Share2, Trash2, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const { data: article, isLoading, error } = useArticle(articleId);
  const { data: comments, isLoading: commentsLoading } = useArticleComments(articleId);
  const { data: likeData } = useLikeStatus(articleId);
  const { user } = useAuth();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const toggleLike = useToggleLike();
  const incrementView = useIncrementView();
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (articleId) {
      incrementView.mutate(articleId);
    }
  }, [articleId]);

  useEffect(() => {
    const handleClickOutside = () => setShowShareMenu(false);
    if (showShareMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showShareMenu]);

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const data: any = { content: commentText };
      if (!user) {
        data.name = guestName || "Anonymous";
        data.email = guestEmail || undefined;
      }
      await addComment.mutateAsync({ articleId, data });
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = `Check out: ${article.title}`;

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text, url });
      } catch {}
    }
    setShowShareMenu(false);
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground uppercase tracking-tighter leading-tight mt-4">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Zeritu Kebede</span>
                </div>
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
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{article._count?.likes ?? likeData?.count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{article._count?.comments ?? comments?.length ?? 0}</span>
                  </div>
                </div>
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
          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:mb-6 prose-p:leading-relaxed prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-black prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-img:rounded-2xl">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Like & Share Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="lg"
              className={`rounded-full gap-2 ${likeData?.liked ? "bg-red-50 border-red-200 text-red-600" : ""}`}
              onClick={() => user ? toggleLike.mutate({ articleId, liked: !!likeData?.liked }) : null}
            >
              <Heart className={`w-5 h-5 ${likeData?.liked ? "fill-current" : ""}`} />
              {likeData?.count ?? article._count?.likes ?? 0}
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2"
                onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
              {showShareMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-background border border-border rounded-xl shadow-xl p-2 flex gap-1 z-50" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleShare("facebook")} className="p-2 hover:bg-secondary/10 rounded-lg transition-colors" aria-label="Share on Facebook">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button onClick={() => handleShare("twitter")} className="p-2 hover:bg-secondary/10 rounded-lg transition-colors" aria-label="Share on Twitter">
                    <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button onClick={() => handleShare("telegram")} className="p-2 hover:bg-secondary/10 rounded-lg transition-colors" aria-label="Share on Telegram">
                    <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </button>
                  <button onClick={() => handleShare("whatsapp")} className="p-2 hover:bg-secondary/10 rounded-lg transition-colors" aria-label="Share on WhatsApp">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <button onClick={() => handleShare()} className="p-2 hover:bg-secondary/10 rounded-lg transition-colors" aria-label="Share via device">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-border pt-8 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments ({comments?.length ?? 0})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-3 bg-secondary/5 rounded-2xl p-6">
              {!user && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                </div>
              )}
              <textarea
                placeholder={user ? "Write a comment..." : "Write a comment as guest..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full gap-2"
                  disabled={addComment.isPending || !commentText.trim()}
                >
                  {addComment.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Post Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-secondary/5 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {(comment.user?.name || comment.name || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {comment.user?.name || comment.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      {(user?.id === comment.userId || user?.role === "ADMIN") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteComment.mutate({ articleId, commentId: comment.id })}
                          aria-label="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground pl-10">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-8 mt-12">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <p>
                  Written by <span className="font-medium text-foreground">Zeritu Kebede</span>
                </p>
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
