"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useProducts, useDeleteProduct, useUpdateProduct } from "@/hooks/use-products";
import { useArticles, useDeleteArticle } from "@/hooks/use-articles";
import { useAuth } from "@/hooks/use-auth";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-events";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import { ArticleForm } from "@/components/dashboard/article-form";
import { EventForm } from "@/components/dashboard/event-form";
import { Product } from "@/lib/api/products";
import { Article } from "@/lib/api/articles";
import { Event, CreateEventData } from "@/lib/api/events";
import { getImageUrl } from "@/lib/utils";
import { Order } from "@/lib/api/orders";
import {
  Package, FileText, ShoppingBag, LogOut, Plus, Search, Edit, Trash2,
  LayoutGrid, Table2, Eye, EyeOff, Heart, MessageCircle, BarChart3,
  Users, Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"store" | "articles" | "orders" | "events">("orders");
  const [storeView, setStoreView] = useState<"table" | "grid">("grid");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: productSearchQuery || undefined,
    includeInactive: includeInactive ? 'true' : undefined,
  });
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    search: articleSearchQuery || undefined,
  });
  const { data: ordersData, isLoading: ordersLoading } = useOrders();
  const { data: eventsData, isLoading: eventsLoading } = useEvents();

  const deleteProduct = useDeleteProduct();
  const deleteArticle = useDeleteArticle();
  const deleteEvent = useDeleteEvent();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateProduct = useUpdateProduct();

  const products = productsData?.products || [];
  const articles = articlesData?.articles || [];
  const orders = ordersData || [];
  const events = eventsData?.events || [];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/dashboard');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, authLoading, router]);

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

  if (!user || !isAdmin) {
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

  const handleToggleProductActive = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: { isActive: !product.isActive },
      });
    } catch (error) {
      console.error('Failed to toggle product status:', error);
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

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete event:', error);
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

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", class: "bg-red-100 text-red-800" };
    if (stock <= 5) return { label: `Low (${stock})`, class: "bg-yellow-100 text-yellow-800" };
    return { label: `In Stock (${stock})`, class: "bg-green-100 text-green-800" };
  };

  const stats = {
    totalProducts: products.length,
    totalArticles: articles.length,
    totalOrders: orders.length,
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Manage your store, articles, and orders</p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.totalArticles}</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
              </div>
            </div>
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
              onClick={() => setActiveTab("events")}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "events"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Events
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
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border bg-secondary/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeInactive}
                      onChange={(e) => setIncludeInactive(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Include inactive
                  </label>
                  <div className="flex bg-secondary/5 border border-border rounded-lg p-1">
                    <button
                      onClick={() => setStoreView("grid")}
                      className={`p-2 rounded-md transition-colors ${storeView === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStoreView("table")}
                      className={`p-2 rounded-md transition-colors ${storeView === "table" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                      aria-label="Table view"
                    >
                      <Table2 className="w-4 h-4" />
                    </button>
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
              </div>

              {productsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No products yet</p>
                  <p className="text-sm mt-1">Click "Add New Product" to get started.</p>
                </div>
              ) : storeView === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => {
                    const stock = getStockBadge(product.stock);
                    return (
                      <div key={product.id} className={`bg-secondary/5 border border-border rounded-2xl overflow-hidden group transition-all hover:shadow-lg ${!product.isActive ? "opacity-60" : ""}`}>
                        <div className="relative aspect-square bg-muted">
                          <Image
                            src={getImageUrl(product.image)}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${stock.class}`}>
                              {stock.label}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                              className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                              aria-label={`Edit ${product.title}`}
                            >
                              <Edit className="w-4 h-4 text-foreground" />
                            </button>
                            <button
                              onClick={() => handleToggleProductActive(product)}
                              className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                              aria-label={`${product.isActive ? "Deactivate" : "Activate"} ${product.title}`}
                            >
                              {product.isActive ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-foreground" />}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                              aria-label={`Delete ${product.title}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="text-[10px] font-medium text-primary uppercase tracking-wider">
                            {product.category}
                          </div>
                          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{product.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{product.price.toFixed(2)} ETB</span>
                            {!product.isActive && (
                              <span className="text-[10px] text-muted-foreground bg-secondary/10 px-1.5 py-0.5 rounded">Inactive</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {products.map((product) => {
                        const stock = getStockBadge(product.stock);
                        return (
                          <tr key={product.id} className={!product.isActive ? "opacity-50" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Image src={getImageUrl(product.image)} alt={product.title} width={40} height={40} className="rounded-md object-cover" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{product.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.price.toFixed(2)} ETB</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${stock.class}`}>{stock.label}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>
                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleToggleProductActive(product)}
                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                aria-label={`${product.isActive ? "Deactivate" : "Activate"} ${product.title}`}
                              >
                                {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                aria-label={`Edit ${product.title}`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                aria-label={`Delete ${product.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
              {articlesLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading articles...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No articles yet</p>
                  <p className="text-sm mt-1">Click "Add New Article" to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Engagement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {articles.map((article) => (
                        <tr key={article.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{article.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Zeritu Kebede</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {article.viewCount ?? 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {article._count?.likes ?? 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {article._count?.comments ?? 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              article.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {article.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/articles/${article.id}`} className="p-2 text-primary hover:text-primary/80 inline-block" aria-label="View article">
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setEditingArticle(article);
                                setShowArticleForm(true);
                              }}
                              className="p-2 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`Edit ${article.title}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              aria-label={`Delete ${article.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div />
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setEditingEvent(undefined);
                    setShowEventForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Event
                </Button>
              </div>
              {eventsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No events yet</p>
                  <p className="text-sm mt-1">Click "Add New Event" to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Registrations</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Image
                              src={getImageUrl(event.image)}
                              alt={event.title}
                              width={40}
                              height={40}
                              className="rounded-md object-cover w-10 h-10"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{event.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{event.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{event.capacity || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{event._count?.registrations ?? 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status === 'UPCOMING' ? 'bg-green-100 text-green-800' :
                              event.status === 'PAST' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => { setEditingEvent(event); setShowEventForm(true); }}
                              className="p-2 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`Edit ${event.title}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              aria-label={`Delete ${event.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No orders yet</p>
                  <p className="text-sm mt-1">Orders will appear here when customers make purchases.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {order.shippingCity}{order.shippingRegion ? `, ${order.shippingRegion}` : ""}
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

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(undefined);
          }}
        />
      )}
    </div>
  );
}
