import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllRestaurants } from '@/services/restaurantService';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import StarRating from '@/components/ui/StarRating';
import Skeleton from '@/components/ui/Skeleton';
import TiltedCard from '@/components/Animations/TiltedCard';
import SplitText from '@/components/TextAnimations/SplitText';
import ShimmerText from '@/components/TextAnimations/ShimmerText';
import TypewriterText from '@/components/TextAnimations/TypewriterText';
import RotatingText from '@/components/TextAnimations/RotatingText';
import FallingText from '@/components/TextAnimations/FallingText';
import CountUpText from '@/components/TextAnimations/CountUpText';
import SectionReveal from '@/components/Animations/SectionReveal';
import RippleButton from '@/components/Animations/RippleButton';
import ScrollReveal from '@/components/Animations/ScrollReveal';
import StarBorder from '@/components/Animations/StarBorder';
import GlitchReveal from '@/components/Animations/GlitchReveal';
import ScrollSpark from '@/components/Animations/ScrollSpark';

function Home() {
  const [search, setSearch] = useState('');

  const { data: restaurants, isLoading, isError } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getAllRestaurants,
  });

  const filtered = useMemo(() => {
    if (!restaurants) return [];
    const term = search.trim().toLowerCase();
    if (!term) return restaurants;
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.address.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
    );
  }, [restaurants, search]);

  // 🔍 If still loading or no data yet, show skeletons
  if (isLoading || !restaurants) {
    return (
      <div className="min-h-screen text-white">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-2xl p-4 space-y-3 border border-white/10 backdrop-blur-sm">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <p className="text-red-500">Failed to load restaurants. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Brand Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 p-6 md:p-10 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="z-10 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
                🍔 <ShimmerText text="Bite" /> <span className="text-white">Now</span>
              </h1>
              <SplitText 
                text="Fresh Food, Delivered Fast — Anytime, Anywhere!" 
                className="text-white/80 text-sm md:text-base" 
              />
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="rounded-3xl bg-black/25 border border-white/10 px-5 py-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-100/80">Live restaurants</p>
                  <div className="mt-2 text-4xl font-bold text-white">
                    <CountUpText value={restaurants?.length ?? 0} format={(v) => `${Math.round(v)}`} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RotatingText words={['Fast', 'Fresh', 'Hot', 'Local']} />
                  <p className="text-sm text-white/80">Premium food delivery vibes</p>
                </div>
              </div>
            </div>
            <div className="relative mt-4 md:mt-0">
              <div className="text-6xl md:text-8xl animate-float">🍕</div>
              <ScrollSpark className="absolute -top-8 left-1/2 -translate-x-1/2" />
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <SectionReveal className="flex gap-2 mb-6">
          <Input
            placeholder="Search restaurants or dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white placeholder:text-white/40 rounded-2xl backdrop-blur-sm"
          />
          {search && (
            <RippleButton
              type="button"
              className="border border-white/10 text-white/60 hover:bg-white/10 rounded-2xl px-5 py-3"
              onClick={() => setSearch('')}
            >
              Clear
            </RippleButton>
          )}
        </SectionReveal>

        {/* Restaurants Grid */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-bold">
            <FallingText text="Recommended For You" />
          </h2>
          <span className="text-orange-500 text-sm font-semibold">
            <TypewriterText text="See All →" speed={60} />
          </span>
        </div>

        {restaurants && restaurants.length === 0 && (
          <p className="text-white/60">No restaurants available.</p>
        )}

        {filtered.length > 0 && (
          <SectionReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((restaurant, index) => (
              <ScrollReveal key={restaurant.id}>
                <Link to={`/restaurants/${restaurant.id}`}>
                  <TiltedCard>
                    <Card className="bg-zinc-900 border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all h-full overflow-hidden">
                        <div className="h-48 w-full bg-zinc-800 overflow-hidden">
                          {restaurant.imageUrl ? (
                            <img
                              src={`${restaurant.imageUrl}?t=${Date.now()}`}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                // fallback to a neutral image
                                // use currentTarget to avoid React synthetic event quirks
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop&q=80';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-zinc-800 to-zinc-900">
                              <span role="img" aria-label="Restaurant">🍽️</span>
                            </div>
                          )}
                        </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-bold text-lg text-white">
                          <GlitchReveal>{restaurant.name}</GlitchReveal>
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-1">{restaurant.address}</p>
                        {restaurant.reviewCount > 0 ? (
                          <div className="flex items-center gap-1">
                            <StarRating rating={restaurant.averageRating} size="text-sm" />
                            <span className="text-gray-400 text-sm">({restaurant.reviewCount})</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No reviews yet</p>
                        )}
                        <StarBorder className="w-full mt-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 rounded-xl transition">
                          Add to Cart
                        </StarBorder>
                      </CardContent>
                    </Card>
                  </TiltedCard>
                </Link>
              </ScrollReveal>
            ))}
          </SectionReveal>
        )}

        {restaurants && restaurants.length > 0 && filtered.length === 0 && search !== '' && (
          <p className="text-white/60">No restaurants match "{search}".</p>
        )}
      </div>
    </div>
  );
}

export default Home;