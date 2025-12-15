"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { Product, CreateProductData } from "@/lib/api/products";
import { Loader2, X } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "Merch",
    stock: product?.stock || 0,
    isActive: product?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const [error, setError] = useState("");

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: { ...formData, image: imageFile || undefined },
        });
      } else {
        if (!imageFile) {
          setError("Image is required");
          return;
        }
        await createProduct.mutateAsync({ ...formData, image: imageFile });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
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

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
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
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                required
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock *</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
                }
                required
                className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as "Books" | "Music" | "Merch",
                })
              }
              required
              className="w-full px-4 py-2 rounded-lg border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="Books">Books</option>
              <option value="Music">Music</option>
              <option value="Merch">Merch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image {!product && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!product}
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
                product ? "Update Product" : "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}








