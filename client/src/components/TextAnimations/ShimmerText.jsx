function ShimmerText({ text, className = '' }) {
  return (
    <span className={`bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer ${className}`}>
      {text}
    </span>
  );
}

export default ShimmerText;