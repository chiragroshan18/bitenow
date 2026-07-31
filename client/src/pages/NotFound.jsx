import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container py-10 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Page not found.</p>
      <Link to="/" className="text-primary underline mt-4 inline-block">
        Go home
      </Link>
    </div>
  );
}

export default NotFound;