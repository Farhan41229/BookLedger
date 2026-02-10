import { useState, useEffect } from 'react';
import { Book, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';

const navLinks = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'About', path: '/about' },
];

const getInitials = (name) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const { user, token, logout } = useAuthStore();

  const linkKey = (link) => link.path ?? link.id;
  const activeNavKey =
    navLinks.find((l) => l.path && pathname === l.path)?.path ??
    navLinks.find((l) => l.id && activeSection === l.id)?.id ??
    null;
  const underlineTarget = hovered ?? activeNavKey;

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    toast.success('Successfully logged out');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy — only on Landing, observe section ids
  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    navLinks.forEach((link) => {
      if (!link.id) return;
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (link) => {
    setMobileOpen(false);
    if (link.path) {
      navigate(link.path);
    } else if (pathname === '/') {
      scrollToSection(link.id);
    } else {
      navigate(`/#${link.id}`);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b shadow-lg shadow-primary/5'
            : 'bg-transparent',
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => (pathname === '/' ? scrollToSection('hero') : navigate('/'))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25"
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Book className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight">
                BookLedger
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const key = linkKey(link);
                const isActive = underlineTarget === key;
                const content = (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        key={key}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full origin-left"
                      />
                    )}
                  </>
                );
                return link.path ? (
                  <Link
                    key={key}
                    to={link.path}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {content}
                  </button>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user && token ? (
                <>
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="animated-gradient text-white shadow-md shadow-primary/25"
                    asChild
                  >
                    <Link to="/auth/login">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b shadow-lg md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link, index) => {
                const key = linkKey(link);
                const isActive = underlineTarget === key;
                const className = cn(
                  'block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'text-foreground bg-primary/5 border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                );
                return link.path ? (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link to={link.path} className={className} onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={key}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleNavClick(link)}
                    className={className}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
              <div className="flex items-center gap-3 pt-3 border-t mt-3">
                {user && token ? (
                  <>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to="/auth/login">Sign In</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 animated-gradient text-white shadow-md shadow-primary/25"
                      asChild
                    >
                      <Link to="/auth/login">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
