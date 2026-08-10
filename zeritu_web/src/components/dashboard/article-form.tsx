"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreateArticle, useUpdateArticle } from "@/hooks/use-articles";
import { Article, CreateArticleData } from "@/lib/api/articles";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { getImageUrl } from "@/lib/utils";
import { Loader2, X, Upload, Link as LinkIcon } from "lucide-react";

interface ArticleFormProps {
  article?: Article;
  onClose: () => void;
}

export function ArticleForm({ article, onClose }: ArticleFormProps) {
  const [formData, setFormData] = useState<CreateArticleData>({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    published: article?.published || false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(article?.image || "");
  const [imageTab, setImageTab] = useState<"file" | "url">(article?.image && !article?.image.startsWith("blob:") ? "url" : "file");
  const [imagePreview, setImagePreview] = useState<string | null>(
    getImageUrl(article?.image || null)
  );
  const [error, setError] = useState("");

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (article) {
        const updateData: any = { ...formData };
        if (imageFile) {
          updateData.image = imageFile;
        } else if (imageUrl && imageTab === "url") {
          updateData.imageUrl = imageUrl;
        }
        await updateArticle.mutateAsync({
          id: article.id,
          data: updateData,
        });
      } else {
        if (imageTab === "file" && !imageFile) {
          setError("Image is required");
          return;
        }
        const createData: any = { ...formData };
        if (imageFile) {
          createData.image = imageFile;
        } else if (imageUrl) {
          createData.imageUrl = imageUrl;
        }
        await createArticle.mutateAsync(createData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || "Failed to save article");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isLoading = createArticle.isPending || updateArticle.isPending;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex">
      <div className="bg-background w-full h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 md:px-10 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {article ? "Edit Article" : "Add New Article"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Article title"
              className="w-full px-4 py-3 text-lg font-bold rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={2}
              placeholder="A short summary of the article..."
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Start writing your article..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image {!article && "*"}
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageTab("file")}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${imageTab === "file" ? "bg-primary text-white" : "bg-secondary/5 text-muted-foreground hover:text-foreground"}`}
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${imageTab === "url" ? "bg-primary text-white" : "bg-secondary/5 text-muted-foreground hover:text-foreground"}`}
              >
                <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
                Image URL
              </button>
            </div>
            {imageTab === "file" ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!article && !imageUrl}
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                  } else {
                    setImagePreview(null);
                  }
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            )}
            {imagePreview && (
              <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                article ? "Update Article" : "Create Article"
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
