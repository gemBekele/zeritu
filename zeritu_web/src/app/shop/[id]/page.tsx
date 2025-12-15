"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Loader2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { useState } from "react";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const { data: product, isLoading, error } = useProduct(productId);
  const { addItem, items, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  const cartItem = items.find(item => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="relative aspect-square bg-secondary/5 rounded-3xl overflow-hidden">
            <Image
              src={getImageUrl(product.image)}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-sm font-medium text-primary uppercase tracking-wider">
                {product.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                {product.title}
              </h1>
              <div className="text-2xl font-medium text-muted-foreground">
                {product.price.toFixed(2)} ETB
              </div>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="pt-8 border-t space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2 border rounded-full px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleUpdateQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleUpdateQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button size="lg" className="w-full md:w-auto px-12 py-6 text-lg rounded-full gap-3" onClick={handleAddToCart}>
                <ShoppingBag className="w-5 h-5" />
                Add to Cart {quantity > 1 && `(${quantity})`}
              </Button>
              {currentQuantity > 0 && (
                <p className="text-sm text-muted-foreground">
                  {currentQuantity} {currentQuantity === 1 ? 'item' : 'items'} in cart
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
