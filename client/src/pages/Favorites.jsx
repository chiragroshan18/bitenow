import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMyFavorites } from '@/services/favoriteService';
import { Card, CardContent } from '@/components/ui/Card';
import StarRating from '@/components/ui/StarRating';

function Favorites() {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getMyFavorites,
  });

  if (isLoading) return <div className="container py-10">Loading favorites...</div>;

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      {favorites?.length === 0 && (
        <p className="text-muted-foreground">
          You haven't favorited any restaurants yet.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites?.map((r) => (
          <Link key={r.id} to={`/restaurants/${r.id}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent>
                <h2 className="font-semibold text-lg">{r.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{r.address}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Favorites;