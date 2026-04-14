import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  Book as BookIcon,
  RotateCcw,
  ShoppingCart,
  Search,
  Clock,
  Compass,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import API from '@/lib/axios';
import useCartStore from '@/store/cartStore';
import { Link } from 'react-router';

// Helper to shuffle array
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const CatalogPage = () => {
  const [viewMode, setViewMode] = useState('discovery'); // 'discovery' | 'standard'

  // Discovery Mode State
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mysteryBooks, setMysteryBooks] = useState([]);
  const [mode, setMode] = useState('prompt'); // 'prompt' | 'cards'
  const [flippedCards, setFlippedCards] = useState({}); // { index: boolean }
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Standard Mode State
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Preview Modal State
  const [previewBook, setPreviewBook] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { addItem } = useCartStore();

  // Timer Effect
  useEffect(() => {
    let timer;
    if (mode === 'cards' && viewMode === 'discovery') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setMode('prompt');
            setPrompt('');
            setMysteryBooks([]);
            toast.error("Time's up! The mystery cards faded away.");
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(300);
    }
    return () => clearInterval(timer);
  }, [mode, viewMode]);

  // Fetch standard books when switching to standard view
  useEffect(() => {
    if (viewMode === 'standard' && books.length === 0) {
      const fetchBooks = async () => {
        setLoadingBooks(true);
        try {
          const res = await API.get('/books');
          setBooks(res.data.books || []);
        } catch (error) {
          console.log(error);
          toast.error('Failed to load books for catalog');
        } finally {
          setLoadingBooks(false);
        }
      };
      fetchBooks();
    }
  }, [viewMode, books.length]);

  const handleDiscover = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsSearching(true);
    try {
      const res = await API.post('/books/recommend', { message: prompt });
      let matchedBooks = res.data.books || [];

      if (matchedBooks.length > 10) {
        matchedBooks = matchedBooks.slice(0, 10);
      }

      const finalSelection = shuffleArray(matchedBooks);

      setMysteryBooks(finalSelection);
      setFlippedCards({});
      setMode('cards');
      setTimeLeft(300); // Reset timer just in case
    } catch (error) {
      console.error('Failed to discover books:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while finding recommendations.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleFlip = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: true }));
  };

  const handleSkip = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: 'skipped' }));
  };

  const handleAddToCart = (book, index) => {
    addItem(book);
    setFlippedCards((prev) => ({ ...prev, [index]: 'purchased' }));
  };

  const resetDiscovery = () => {
    setMode('prompt');
    setPrompt('');
    setMysteryBooks([]);
    setTimeLeft(300);
  };

  // Standard Mode Filters
  const genres = ['All', ...new Set(books.map((b) => b.genre).filter(Boolean))];

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || b.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background relative overflow-hidden">
      {/* Background effects only on discovery mode */}
      {viewMode === 'discovery' && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Toggle Switch */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="inline-flex rounded-lg border border-border/50 p-1 bg-muted/30">
            <button
              onClick={() => setViewMode('discovery')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'discovery'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Discovery</span>
            </button>
            <button
              onClick={() => setViewMode('standard')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'standard'
                  ? 'bg-card text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Standard Store</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ===================== VIEW 1: AI DISCOVERY ===================== */}
          {viewMode === 'discovery' && (
            <motion.div
              key="view-discovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {/* STEP 1: PROMPT MODE */}
              {mode === 'prompt' && (
                <motion.div
                  key="prompt-mode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center min-h-[50vh] max-w-3xl mx-auto text-center space-y-8"
                >
                  <div className="space-y-4">
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                      What kind of{' '}
                      <span className="gradient-text">adventure</span> do you
                      seek?
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl">
                      Tell us what you're in the mood for, and we'll deal you 10
                      mystery books that match your vibe.
                    </p>
                  </div>

                  <form
                    onSubmit={handleDiscover}
                    className="w-full relative shadow-2xl rounded-2xl group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-emerald-500/30 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50"></div>
                    <div className="relative flex items-center bg-card border border-border/50 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                      <Input
                        placeholder="e.g. A thrilling space opera with betrayals..."
                        className="flex-1 border-0 bg-transparent text-lg md:text-xl h-14 md:h-16 px-6 focus-visible:ring-0 shadow-none"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isSearching}
                        autoFocus
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="h-12 md:h-14 px-8 rounded-xl animated-gradient text-white font-semibold text-lg"
                        disabled={isSearching || !prompt.trim()}
                      >
                        {isSearching ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          'Deal My Cards'
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: MYSTERY CARDS MODE */}
              {mode === 'cards' && (
                <motion.div
                  key="cards-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left mb-8 bg-card/40 p-6 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm">
                    <div>
                      <h2 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
                        Your Mystery Selection
                        <div className="flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" />
                          {formatTime(timeLeft)}
                        </div>
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        Pick a card to reveal a book matching:{' '}
                        <span className="font-medium text-foreground italic">
                          "{prompt}"
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={resetDiscovery}
                      className="shrink-0 bg-background/50 hover:bg-background shadow-none"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try New Prompt
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 perspective-1000">
                    {mysteryBooks.map((book, index) => {
                      const isFlipped = flippedCards[index] === true;
                      const isSkipped = flippedCards[index] === 'skipped';
                      const isPurchased = flippedCards[index] === 'purchased';

                      if (isSkipped) {
                        return (
                          <motion.div
                            key={`skipped-${index}`}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ duration: 0.4 }}
                            className="h-[400px] w-full"
                          />
                        );
                      }

                      if (isPurchased) {
                        return (
                          <motion.div
                            key={`purchased-${index}`}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 0, scale: 1.1, y: -50 }}
                            transition={{ duration: 0.4 }}
                            className="h-[400px] w-full"
                          />
                        );
                      }

                      return (
                        <div
                          key={book._id}
                          className="relative h-[400px] w-full perspective-1000 group cursor-pointer"
                          onClick={() => !isFlipped && handleFlip(index)}
                        >
                          <motion.div
                            className="w-full h-full relative preserve-3d transition-all duration-700 ease-out"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                          >
                            {/* Front of Card (Hidden Mystery) */}
                            <div className="absolute inset-0 backface-hidden rotate-y-0-front bg-card border-2 border-primary/20 rounded-xl shadow-xl flex flex-col items-center justify-center p-6 text-center hover:border-primary/50 hover:shadow-primary/20 transition-all">
                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay rounded-xl pointer-events-none"></div>
                              <Sparkles className="h-12 w-12 text-primary/60 mb-4 animate-pulse" />
                              <h3 className="text-2xl font-serif font-bold text-foreground/80">
                                Mystery Book
                              </h3>
                              <p className="text-muted-foreground mt-2 font-medium">
                                Click to reveal
                              </p>
                            </div>

                            {/* Back of Card (Revealed Book) */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180-back bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                              <div className="h-48 w-full bg-muted relative shrink-0">
                                {book.coverImage ? (
                                  <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <BookIcon className="h-12 w-12 text-muted-foreground/30" />
                                  </div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 rounded-full h-8 w-8 backdrop-blur-sm z-10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewBook({ book, index });
                                    setIsPreviewOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-2">
                                  <h4 className="text-white font-bold leading-tight line-clamp-2">
                                    {book.title}
                                  </h4>
                                  <p className="text-white/80 text-xs">
                                    {book.author}
                                  </p>
                                </div>
                              </div>

                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-primary">
                                      ${Number(book.price).toFixed(2)}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px]"
                                    >
                                      {book.genre}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-3">
                                    {book.description ||
                                      'No synopsis available.'}
                                  </p>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSkip(index);
                                    }}
                                  >
                                    Skip
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 animated-gradient text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToCart(book, index);
                                    }}
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ===================== VIEW 2: STANDARD CATALOG ===================== */}
          {viewMode === 'standard' && (
            <motion.div
              key="view-standard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Explore Our{' '}
                  <span className="text-foreground">Collection</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Browse gracefully through thousands of books across all
                  genres.
                </p>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full whitespace-nowrap"
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>

                <div className="relative w-full md:w-72 mt-2 md:mt-0">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search title or author..."
                    className="pl-9 bg-card shadow-sm rounded-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Book Grid */}
              {loadingBooks ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center h-64 flex flex-col items-center justify-center space-y-3 bg-muted/20 rounded-2xl border border-dashed">
                  <BookIcon className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-xl text-muted-foreground font-medium">
                    No books found.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      setSelectedGenre('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredBooks.map((book) => (
                    <Link to={`/books/${book._id}`} key={book._id}>
                      <div>
                        <Card className="h-full overflow-hidden border-transparent hover:border-border/50 bg-card/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                          <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-2">
                                <BookIcon className="h-12 w-12" />
                              </div>
                            )}

                            {book.stockQuantity <= 0 && (
                              <div className="absolute inset-x-0 bottom-0 bg-red-500/90 text-white text-xs text-center py-1 font-semibold backdrop-blur-sm">
                                OUT OF STOCK
                              </div>
                            )}
                          </div>

                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {book.title}
                              </h3>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                              {book.author}
                            </p>

                            <div className="pt-2 flex items-center justify-between">
                              <span className="font-bold text-lg">
                                ${Number(book.price).toFixed(2)}
                              </span>
                              {book.genre && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-2 font-normal bg-secondary/50"
                                >
                                  {book.genre}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================== PREVIEW MODAL ===================== */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-2xl bg-card border-border/50 backdrop-blur-xl p-0 overflow-hidden">
            <div className="flex flex-col md:flex-row max-h-[85vh]">
              {/* Image Side */}
              <div className="md:w-2/5 bg-muted relative shrink-0">
                {previewBook?.book?.coverImage ? (
                  <img
                    src={previewBook.book.coverImage}
                    alt={previewBook.book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center min-h-[250px]">
                    <BookIcon className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <DialogHeader className="text-left space-y-1">
                    <DialogTitle className="text-2xl font-bold font-serif leading-tight">
                      {previewBook?.book?.title}
                    </DialogTitle>
                    <DialogDescription className="text-base font-medium flex items-center gap-2">
                      <span className="text-foreground">
                        {previewBook?.book?.author}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <Badge variant="secondary" className="font-normal">
                        {previewBook?.book?.genre}
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>

                  <div>
                    <div className="font-bold text-2xl text-primary mb-4">
                      ${Number(previewBook?.book?.price || 0).toFixed(2)}
                    </div>
                    <div className="prose prose-sm dark:prose-invert">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Synopsis
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {previewBook?.book?.description ||
                          'No synopsis available for this book.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => {
                      handleSkip(previewBook?.index);
                      setIsPreviewOpen(false);
                    }}
                  >
                    Skip
                  </Button>
                  <Button
                    className="flex-1 h-12 animated-gradient text-white text-base"
                    onClick={() => {
                      handleAddToCart(previewBook?.book, previewBook?.index);
                      setIsPreviewOpen(false);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CatalogPage;
