"use client";

import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-orders";
import { ordersApi } from "@/lib/api/orders";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data: order, isLoading, refetch } = useOrder(orderId || "");
  const queryClient = useQueryClient();
  const [verifying, setVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const verifyPayment = useCallback(async () => {
    if (!orderId) return;
    
    setVerifying(true);
    try {
      console.log('Verifying payment for order:', orderId);
      const result = await ordersApi.verifyPayment(orderId);
      console.log('Verification result:', result);
      
      if (result.updated || result.order.paymentStatus === 'PAID') {
        queryClient.setQueryData(['orders', orderId], result.order);
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        await refetch();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to verify payment:', error);
      return false;
    } finally {
      setVerifying(false);
    }
  }, [orderId, queryClient, refetch]);

  // Verify payment when page loads - always verify if payment is pending
  useEffect(() => {
    if (orderId && order && order.paymentStatus === 'PENDING' && verificationAttempts < 5) {
      const timer = setTimeout(async () => {
        setVerificationAttempts(prev => prev + 1);
        const success = await verifyPayment();
        if (!success && verificationAttempts < 4) {
          // Will trigger another attempt via the effect
        }
      }, verificationAttempts * 2000); // Increasing delays: 0s, 2s, 4s, 6s, 8s
      
      return () => clearTimeout(timer);
    }
  }, [orderId, order, verifyPayment, verificationAttempts]);

  const handleManualVerify = async () => {
    await verifyPayment();
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-6">
            <h1 className="text-3xl font-bold">Order Not Found</h1>
            <p className="text-muted-foreground">
              We couldn't find your order. Please contact support if you believe this is an error.
            </p>
            <Link href="/shop">
              <Button className="rounded-full">Continue Shopping</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-secondary uppercase tracking-tighter">
              Order Placed!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your order. We've received it and will process it shortly.
            </p>
          </div>

          <div className="bg-secondary/5 rounded-2xl p-6 space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm">{order.id.slice(0, 6).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg">{order.total.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-muted-foreground">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Status</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {verifying && order.paymentStatus === 'PENDING' && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  {order.paymentStatus}
                </span>
                {order.paymentStatus === 'PENDING' && !verifying && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManualVerify}
                    className="h-7 px-2"
                    title="Refresh payment status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {order.paymentStatus === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">Payment verification in progress</p>
              <p className="text-xs mt-1">
                If you completed the payment, please wait a moment while we verify it. 
                You can also click the refresh button above to check the status manually.
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href={`/orders/${order.id}`}>
              <Button className="rounded-full">
                View Order Details
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}



