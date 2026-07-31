import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSchema } from '@/features/auth/validators';
import { loginUser } from '@/services/authService';
import { setCredentials } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await loginUser(data);
      dispatch(setCredentials(result));

      const roleRedirects = {
        ADMIN: '/admin',
        RESTAURANT_OWNER: '/owner',
        DELIVERY_PARTNER: '/delivery',
        CUSTOMER: '/',
      };
      navigate(roleRedirects[result.user.role] || '/');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && (
            <p className="text-destructive text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-destructive text-sm">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;