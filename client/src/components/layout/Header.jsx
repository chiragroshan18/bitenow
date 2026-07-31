import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingCart, Heart, Home, User } from 'lucide-react';
import { toggleDarkMode } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    cn(
      'text-sm transition-all duration-200 ease-out inline-flex items-center gap-2',
      isActive
        ? 'text-white font-semibold underline underline-offset-4 decoration-orange-400'
        : 'text-white/70 hover:text-white hover:scale-[1.02]'
    );

  const NavLinks = ({ onClick }) => (
    <>
      <NavLink to="/" className={navLinkClass} onClick={onClick} end>
        <Home size={16} />
        Home
      </NavLink>
      {isAuthenticated && user.role === 'CUSTOMER' && (
        <>
          <NavLink to="/my-orders" className={navLinkClass} onClick={onClick}>
            <Heart size={16} />
            My Orders
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass} onClick={onClick}>
            <Heart size={16} />
            Favorites
          </NavLink>
        </>
      )}
      <NavLink to="/cart" className={navLinkClass} onClick={onClick}>
        <ShoppingCart size={16} />
        Cart {cartCount > 0 && `(${cartCount})`}
      </NavLink>
      {isAuthenticated ? (
        <span className="text-sm text-white/50">{user.name}</span>
      ) : (
        <NavLink to="/login" className={navLinkClass} onClick={onClick}>
          <User size={16} />
          Log in
        </NavLink>
      )}
      <button
        onClick={() => dispatch(toggleDarkMode())}
        className="text-sm text-white/70 hover:text-white transition"
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'bg-[#0d0d0d]/95 shadow-2xl shadow-black/20 border-b border-white/10' : 'bg-[#0d0d0d]/80'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <Link
          to="/"
          className="flex items-center gap-2 select-none"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-2xl leading-none">🍔</span>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-orange-500">Bite</span>
            <span className="text-white"> Now</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <NavLinks />
        </div>

        <button
          className="sm:hidden p-2 text-white"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-4 bg-[#0d0d0d]">
          <NavLinks onClick={() => setMobileOpen(false)} />
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </header>
  );
}

export default Header;