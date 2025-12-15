"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateArticle, useUpdateArticle } from "@/hooks/use-articles";
import { Article, CreateArticleData } from "@/lib/api/articles";
import { Loader2, X } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(
    article?.image || null
  );
  const [error, setError] = useState("");

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (article) {
        // For updates, only include image if a new file is selected
        const updateData: any = { ...formData };
        if (imageFile) {
          updateData.image = imageFile;
        }
        await updateArticle.mutateAsync({
          id: article.id,
          data: updateData,
        });
      } else {
        if (!imageFile) {
          setError("Image is required");
          return;
        }
        await createArticle.mutateAsync({ ...formData, image: imageFile });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {article ? "Edit Article" : "Add New Article"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

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
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              rows={10}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image {!article && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!article}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
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
  );
}



