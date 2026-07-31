import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStats } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/Card';

function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getStats,
  });

  if (isLoading) return <div className="container py-10">Loading stats...</div>;

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/users" className="text-primary text-sm underline">
          Manage Users →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Restaurants" value={stats.totalRestaurants} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard
          label="Revenue (Delivered)"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
        />
      </div>

      <h2 className="font-semibold mb-3">Orders by Status</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(stats.ordersByStatus).map(([status, count]) => (
          <Card key={status}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{status}</p>
              <p className="text-xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;