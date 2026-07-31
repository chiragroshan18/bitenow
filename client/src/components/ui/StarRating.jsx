function StarRating({ rating = 0, size = 'text-base' }) {
  return (
    <span className={`inline-flex ${size}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-primary' : 'text-muted-foreground'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default StarRating;