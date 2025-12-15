"use client";

import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, ArrowLeft, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading, error } = useOrder(orderId);
  const { user, isAdmin, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return notFound();
  }

  // Check if user has access to this order (allow access if authenticated and owns order, or is admin)
  if (!isAdmin && order.userId !== user?.id) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/login?redirect=/orders/${orderId}`);
      return null;
    }
    // If authenticated but doesn't own order, redirect home
    router.push("/");
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <Link
            href={isAdmin ? "/dashboard" : "/shop"}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAdmin ? "Back to Dashboard" : "Back to Shop"}
          </Link>

          <div className="bg-secondary/5 rounded-2xl p-8 space-y-8">
            {/* Order Header */}
            <div className="border-b pb-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-secondary uppercase tracking-tighter">
                    Order Details
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Order ID: <span className="font-mono text-sm">{order.id.slice(0, 6).toUpperCase()}</span>
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    <Package className="w-4 h-4" />
                    {order.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-background rounded-lg border"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={getImageUrl(item.product.image)}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price: {item.price.toFixed(2)} ETB each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {(item.price * item.quantity).toFixed(2)} ETB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="bg-background rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{order.total.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">{order.total.toFixed(2)} ETB</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-xl font-bold">Shipping Information</h2>
              <div className="bg-background rounded-lg p-6 space-y-2">
                <p className="font-medium">{order.shippingName}</p>
                <p className="text-muted-foreground">{order.shippingEmail}</p>
                <p className="text-muted-foreground">{order.shippingPhone}</p>
                <p className="text-muted-foreground">{order.shippingAddress}</p>
              </div>
            </div>

            {/* Order Date */}
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Order placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

