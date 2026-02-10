import { useState, useEffect } from "react";
import API from "@/lib/axios";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Trash2, ShoppingCart, Loader2, Minus, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const CashierDashboard = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();

  // Search Debounce Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchBooks(query);
      } else {
        setBooks([]); // Clear results if empty
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchBooks = async (searchTerm) => {
    setSearching(true);
    try {
      const res = await API.get(`/books/search?title=${searchTerm}&availability=inStock`);
      setBooks(res.data.books || []);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setProcessing(true);
    try {
      const payload = {
        cashierId: user?.id,
        totalAmount: getTotal(),
        items: items.map(item => ({
          bookId: item._id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      await API.post('/sales', payload);
      toast.success("Transaction completed!");
      clearCart();
      setQuery(""); // Reset search to encourage new customer interaction
      setBooks([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6 p-2 fade-in">
      {/* LEFT: Product Search & Grid */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search books by title, ISBN..." 
            className="pl-9 h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <ScrollArea className="flex-1 rounded-md border bg-card p-4">
          {searching ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
          ) : books.length === 0 && query ? (
            <div className="text-center text-muted-foreground p-8">No books found.</div>
          ) : books.length === 0 && !query ? (
             <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-2">
                <Search className="h-12 w-12 opacity-20"/>
                <p>Start typing to find books</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <Card key={book._id} className="hover:border-primary cursor-pointer transition-all active:scale-95" onClick={() => addItem(book)}>
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold line-clamp-1" title={book.title}>{book.title}</h3>
                        <Badge variant="outline">${book.price}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    <div className="text-xs flex justify-between mt-2">
                        <span className="text-muted-foreground">ISBN: {book.isbn}</span>
                        <span className={book.stockQuantity < 5 ? "text-amber-600 font-bold" : "text-emerald-600"}>
                            {book.stockQuantity} in stock
                        </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* RIGHT: Cart & Checkout */}
      <Card className="w-full lg:w-[400px] flex flex-col h-full shadow-lg border-primary/20">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Current Sale
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-4 min-h-[200px]">
                    <ShoppingCart className="h-16 w-16" />
                    <p>Cart is empty</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 bg-muted/20 p-2 rounded-lg">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground">${item.price} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon-xs" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                <Button variant="outline" size="icon-xs" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(item._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
          </ScrollArea>

          <div className="p-6 bg-muted/30 border-t space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (0%)</span>
                    <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${getTotal().toFixed(2)}</span>
                </div>
            </div>
            
            <Button 
                className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
                size="lg"
                onClick={handleCheckout}
                disabled={items.length === 0 || processing}
            >
                {processing ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 h-5 w-5" />}
                {processing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashierDashboard;