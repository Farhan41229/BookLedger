import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import API from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Book as BookIcon, Loader2, Share2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '@/store/cartStore';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data.book);
      } catch (error) {
        toast.error('Failed to load book details');
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(book);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image Column */}
          <div className="glass-card p-4 md:p-8 flex justify-center sticky top-28">
            <div className="w-full max-w-sm aspect-[2/3] overflow-hidden rounded-xl shadow-2xl relative bg-muted">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                  <BookIcon className="h-24 w-24 mb-4" />
                  <span>No Cover Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{book.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xl text-muted-foreground font-medium flex items-center gap-2">
                By <span className="text-foreground">{book.author}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {book.genre && (
                <Badge variant="secondary" className="px-3 py-1 text-sm bg-secondary/50">
                  {book.genre}
                </Badge>
              )}
              <Badge variant="outline" className="px-3 py-1 text-sm font-mono text-muted-foreground bg-background">
                ISBN: {book.isbn}
              </Badge>
              {book.stockQuantity > 0 ? (
                <Badge variant="outline" className="px-3 py-1 text-sm text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
                  In Stock ({book.stockQuantity})
                </Badge>
              ) : (
                <Badge variant="destructive" className="px-3 py-1 text-sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-border/50">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold tracking-tight text-primary">
                  ${Number(book.effectivePrice || book.price).toFixed(2)}
                </span>
                {book.discountedPrice && (
                  <span className="text-xl line-through text-muted-foreground">
                    ${Number(book.price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="flex-1 text-base h-14 rounded-xl shadow-lg shadow-primary/20 animated-gradient"
                  disabled={book.stockQuantity <= 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {book.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-primary inline-block"></span>
                About this book
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {/* Real description could be added to DB later, using placeholder here */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
