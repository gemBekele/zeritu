"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/api/products";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if clicking the button
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block relative bg-secondary/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={getImageUrl(product.image)}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            className="rounded-full gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <div className="font-medium text-muted-foreground">
          {product.price.toFixed(2)} ETB
        </div>
      </div>
    </Link>
  );
}
