import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getRestaurantById } from '@/services/restaurantService';
import { getReviewsForRestaurant } from '@/services/reviewService';
import { getMyFavorites, toggleFavorite } from '@/services/favoriteService';
import { addItem, decrementItem } from '@/store/slices/cartSlice';
import { showToast } from '@/store/slices/uiSlice';
import RestaurantMap from '@/components/map/RestaurantMap';
import StarRating from '@/components/ui/StarRating';
import SectionReveal from '@/components/Animations/SectionReveal';
import FallingText from '@/components/TextAnimations/FallingText';
import CountUpText from '@/components/TextAnimations/CountUpText';
import RippleButton from '@/components/Animations/RippleButton';
import MagnetButton from '@/components/Animations/MagnetButton';
import ScrollSpark from '@/components/Animations/ScrollSpark';

function RestaurantDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading, isError } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id),
  });

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsForRestaurant(id),
    enabled: !!restaurant,
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: getMyFavorites,
    enabled: isAuthenticated && user?.role === 'CUSTOMER',
  });
  const isFavorited = favorites?.some((f) => f.id === id);

  const favMutation = useMutation({
    mutationFn: () => toggleFavorite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const getQuantityInCart = (menuItemId) => {
    const item = cartItems.find((i) => i.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item) => {
    dispatch(
      addItem({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      })
    );
    dispatch(showToast({ type: 'success', message: `${item.name} added to cart` }));
  };

  // ✅ Removed handleImageUpload function

  if (isLoading) return <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">Loading...</div>;
  if (isError || !restaurant)
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center text-red-500">
        Restaurant not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Hero Image Section */}
        <SectionReveal className="relative rounded-3xl overflow-hidden mb-4">
          <div className="relative h-64 md:h-80 overflow-hidden">
            {restaurant.imageUrl ? (
              <img
                src={`${restaurant.imageUrl}?t=${Date.now()}`}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&q=80';
                }}
              />
            ) : (
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-600/50 to-zinc-800 flex items-center justify-center text-7xl overflow-hidden">
                <span className="relative z-10">🍽️</span>
              </div>
            )}
            <ScrollSpark className="absolute left-8 top-8 opacity-90" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 flex flex-col gap-3 sm:flex-row sm:justify-around rounded-b-3xl">
            <div className="text-center">
              <p className="text-white/60 text-xs">Rating</p>
              {reviewData?.averageRating ? (
                <p className="text-white font-semibold">
                  ⭐ <CountUpText value={reviewData.averageRating} format={(v) => Number(v).toFixed(1)} />
                </p>
              ) : (
                <p className="text-white font-semibold">New</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs">Time</p>
              <p className="text-white font-semibold">⏱️ 20-30 min</p>
            </div>
          </div>
        </SectionReveal>

        {/* ✅ IMAGE UPLOAD SECTION REMOVED */}

        {/* Title + Favorite Button */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
          {isAuthenticated && user?.role === 'CUSTOMER' && (
            <button
              onClick={() => favMutation.mutate()}
              className="text-2xl"
            >
              {isFavorited ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <p className="text-white/40 text-sm mb-2">{restaurant.address}</p>
        {restaurant.description && (
          <p className="text-white/60 text-sm mb-4">{restaurant.description}</p>
        )}

        {/* Map */}
        <SectionReveal className="mb-6">
          <RestaurantMap
            latitude={restaurant.latitude}
            longitude={restaurant.longitude}
            name={restaurant.name}
            address={restaurant.address}
          />
        </SectionReveal>

        {/* Menu Items - TEXT ONLY (No Images) */}
        <h2 className="text-xl font-bold mb-4">
          <FallingText text="Menu" />
        </h2>
        {restaurant.menuItems.length === 0 && (
          <p className="text-white/40">No menu items yet.</p>
        )}
        <SectionReveal className="space-y-3">
          {restaurant.menuItems.map((item) => {
            const quantity = getQuantityInCart(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 rounded-2xl p-4 border border-white/10 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.description && (
                    <p className="text-white/40 text-sm">{item.description}</p>
                  )}
                  <p className="text-orange-400 font-bold mt-1">₹{item.price.toFixed(2)}</p>
                </div>

                {item.isAvailable ? (
                  <div className="flex items-center gap-2">
                    {quantity > 0 && (
                      <>
                        <MagnetButton
                          type="button"
                          onClick={() => dispatch(decrementItem(item.id))}
                          className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                        >
                          −
                        </MagnetButton>
                        <span className="text-white">{quantity}</span>
                      </>
                    )}
                    <RippleButton
                      type="button"
                      onClick={() => handleAdd(item)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-400 transition"
                    >
                      +
                    </RippleButton>
                  </div>
                ) : (
                  <span className="text-white/40 text-sm">Unavailable</span>
                )}
              </motion.div>
            );
          })}
        </SectionReveal>

        {/* Reviews */}
        <h2 className="text-xl font-bold mt-8 mb-4">
          <FallingText text="Reviews" />
        </h2>
        {reviewData?.reviewCount > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={reviewData.averageRating} size="text-lg" />
              <span className="text-white/40">
                {reviewData.averageRating.toFixed(1)} ({reviewData.reviewCount} reviews)
              </span>
            </div>
            <div className="space-y-3">
              {reviewData.reviews.map((r) => (
                <div key={r.id} className="bg-zinc-900 rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{r.customer.name}</span>
                    <StarRating rating={r.rating} size="text-sm" />
                  </div>
                  {r.comment && <p className="text-white/60 text-sm">{r.comment}</p>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-white/40">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;