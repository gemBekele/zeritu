"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { useArticles } from "@/hooks/use-articles";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteProduct } from "@/hooks/use-products";
import { useDeleteArticle } from "@/hooks/use-articles";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import { ArticleForm } from "@/components/dashboard/article-form";
import { Product } from "@/lib/api/products";
import { Article } from "@/lib/api/articles";
import { getImageUrl } from "@/lib/utils";
import { Order } from "@/lib/api/orders";
import { Package, FileText, ShoppingBag, Settings, LogOut, Plus, Search, Edit, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"store" | "articles" | "orders">("store");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: productSearchQuery || undefined,
  });
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    search: articleSearchQuery || undefined,
  });
  const { data: ordersData, isLoading: ordersLoading } = useOrders();

  const deleteProduct = useDeleteProduct();
  const deleteArticle = useDeleteArticle();
  const updateOrderStatus = useUpdateOrderStatus();

  const products = productsData?.products || [];
  const articles = articlesData?.articles || [];
  const orders = ordersData || [];

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen pt-8 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/login?redirect=/dashboard');
    return null;
  }

  // Redirect if not admin
  if (!isAdmin) {
    router.push('/');
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status, paymentStatus });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tighter">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Manage your store items and articles</p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("store")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "store"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Store Items
            </button>
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Articles
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Orders
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "store" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setEditingProduct(undefined);
                    setShowProductForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </div>
              {/* Product Table */}
              {productsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading products...</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Image 
                              src={getImageUrl(product.image)}
                              alt={product.title} 
                              width={40} 
                              height={40} 
                              className="rounded-md object-cover" 
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{product.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.price.toFixed(2)} ETB</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setEditingArticle(undefined);
                    setShowArticleForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Article
                </Button>
              </div>
              {/* Article Table */}
              {articlesLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading articles...</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {articles.map((article) => (
                        <tr key={article.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{article.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{article.author?.name || article.author?.email || 'Unknown'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              article.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {article.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => {
                                setEditingArticle(article);
                                setShowArticleForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              {ordersLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading orders...</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {order.id.slice(0, 6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div>
                              <div className="font-medium">{order.shippingName}</div>
                              <div className="text-xs">{order.shippingEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {order.total.toFixed(2)} ETB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="px-2 py-1 rounded border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                              order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                              order.paymentStatus === 'REFUNDED' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/orders/${order.id}`}>
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No orders yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}

      {showArticleForm && (
        <ArticleForm
          article={editingArticle}
          onClose={() => {
            setShowArticleForm(false);
            setEditingArticle(undefined);
          }}
        />
      )}
    </div>
  );
}
