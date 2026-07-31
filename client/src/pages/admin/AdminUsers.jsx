import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllUsers, updateUserRole } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/Card';

const ROLES = ['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER', 'ADMIN'];

function AdminUsers() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => getAllUsers(page),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  if (isLoading) return <div className="container py-10">Loading users...</div>;

  return (
    <div className="container py-10 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link to="/admin" className="text-primary text-sm underline">
          ← Back to stats
        </Link>
      </div>

      <div className="space-y-2">
        {data.users.map((u) => (
          <Card key={u.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
              <select
                value={u.role}
                onChange={(e) =>
                  roleMutation.mutate({ userId: u.id, role: e.target.value })
                }
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="text-sm text-primary disabled:text-muted-foreground disabled:no-underline underline"
        >
          ← Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {data.page} of {data.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          disabled={page >= data.totalPages}
          className="text-sm text-primary disabled:text-muted-foreground disabled:no-underline underline"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default AdminUsers;