"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useCreateOrder } from "@/hooks/use-orders";
import { Loader2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, isLoading: cartLoading, updateQuantity } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const createOrder = useCreateOrder();

  // Restore form data from sessionStorage if available (after login redirect)
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('checkoutFormData');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          sessionStorage.removeItem('checkoutFormData');
          return parsed;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return {
      shippingName: user?.name || "",
      shippingEmail: user?.email || "",
      shippingPhone: "",
      shippingAddress: "",
    };
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when user logs in
  useEffect(() => {
    if (user && !formData.shippingName && !formData.shippingEmail) {
      setFormData(prev => ({
        ...prev,
        shippingName: user.name || prev.shippingName,
        shippingEmail: user.email || prev.shippingEmail,
      }));
    }
  }, [user, formData.shippingName, formData.shippingEmail]);

  if (cartLoading || authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only show empty cart message if not submitting and cart is actually empty
  if (!isSubmitting && items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-6">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some items to your cart before checkout.
            </p>
            <Link href="/shop">
              <Button className="rounded-full">Continue Shopping</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Require authentication only when submitting
    if (!isAuthenticated) {
      // Save form data to sessionStorage and redirect to login
      sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
      setIsSubmitting(false);
      router.push("/login?redirect=/shop/checkout");
      return;
    }

    // Check if cart is empty before submitting
    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checkout.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createOrder.mutateAsync(formData);
      
      if (result.payment_url) {
        // Redirect to Chapa payment page immediately
        window.location.href = result.payment_url;
        // Don't set isSubmitting to false here as we're redirecting
        return;
      } else if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        // Order created but no payment URL (might be free order or payment failed)
        setIsSubmitting(false);
        router.push(`/shop/checkout/success?orderId=${result.order.id}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      // Handle validation errors with details
      let errorMessage = "Failed to create order. Please try again.";
      
      if (err.response?.data) {
        const data = err.response.data;
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          if (Array.isArray(data.error)) {
            // Zod validation errors
            errorMessage = data.error.map((e: any) => 
              `${e.path?.join('.') || 'field'}: ${e.message || e}`
            ).join(', ');
          } else if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else {
            errorMessage = JSON.stringify(data.error);
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('Order creation error:', err);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Order Summary</h2>
              <div className="bg-secondary/5 rounded-2xl p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <div className="flex items-center gap-2 border rounded-full px-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-medium mt-1">
                        {(item.price * item.quantity).toFixed(2)} ETB
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{totalPrice.toFixed(2)} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Shipping Information</h2>
              
              {!isAuthenticated && !authLoading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Sign in for faster checkout</p>
                  <p className="text-xs">
                    You can continue as guest, but{" "}
                    <Link href="/login?redirect=/shop/checkout" className="underline font-medium">
                      signing in
                    </Link>{" "}
                    will save your information and allow you to track your orders.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/5 rounded-2xl p-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.shippingName}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.shippingEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingEmail: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.shippingPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingPhone: e.target.value })
                    }
                    required
                    placeholder="+251911234567"
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipping Address *
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full"
                  disabled={createOrder.isPending || isSubmitting || items.length === 0}
                >
                  {createOrder.isPending || isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Proceed to Payment - ${totalPrice.toFixed(2)} ETB`
                  )}
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-center text-muted-foreground">
                    You'll be asked to sign in or create an account before payment
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
