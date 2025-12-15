"use client";

import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { useState } from "react";
import { Search } from "lucide-react";

const categories = ["All", "Books", "Music", "Merch"];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading, error } = useProducts({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  const products = data?.products || [];

  return (
    <div className="min-h-screen pt-50 pb-16">
      <Container>
        <div className="space-y-12">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
             {/* Removed "Shop Zeritu" header as requested */}
             <div className="w-full md:w-auto flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
             </div>

             <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/5 hover:bg-secondary/10 text-muted-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
             </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-xl">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-xl">Error loading products. Please try again.</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-xl">No products found.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
