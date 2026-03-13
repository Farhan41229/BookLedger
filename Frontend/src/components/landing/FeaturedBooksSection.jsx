import { useState, useEffect } from 'react';
import API from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book as BookIcon, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const FeaturedBooksSection = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/books');
        // Just take the first 4-5 books for the featured section
        setFeaturedBooks((res.data.books || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to load featured books', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (featuredBooks.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden" id="featured-books">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured <span className="gradient-text">Additions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Check out our latest and most popular books currently in stock.
            </p>
          </div>
          <Button variant="outline" className="group rounded-full" asChild>
            <Link to="/catalog">
              View All Books
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={`/books/${book._id}`}>
                <Card className="h-full overflow-hidden border-transparent hover:border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-2">
                          <BookIcon className="h-10 w-10" />
                      </div>
                    )}
                    
                    {book.stockQuantity <= 0 && (
                      <div className="absolute inset-x-0 bottom-0 bg-red-500/90 text-white text-xs text-center py-1 font-semibold backdrop-blur-sm">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1 text-sm">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">{book.author}</p>
                    <div className="pt-2">
                      <span className="font-bold text-base text-primary">${Number(book.price).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooksSection;
