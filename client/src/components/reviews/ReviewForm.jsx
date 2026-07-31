import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createReview } from '@/services/reviewService';
import Button from '@/components/ui/Button';

function ReviewForm({ orderId, onDone }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: () => createReview(orderId, { rating, comment: comment || undefined }),
    onSuccess: () => onDone?.(),
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      if (msg.toLowerCase().includes('already')) {
        onDone?.(); // treat "already reviewed" as done, not an error
      } else {
        setError(msg);
      }
    },
  });

  return (
    <div className="p-4 border border-input rounded-md mt-4">
      <p className="font-medium mb-2">Rate this order</p>
      <div className="flex gap-1 mb-3 text-2xl">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            className={s <= rating ? 'text-primary' : 'text-muted-foreground'}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="w-full border border-input rounded-md p-2 text-sm mb-3 bg-background"
        rows={3}
        placeholder="Optional comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="text-destructive text-sm mb-2">{error}</p>}
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? 'Submitting...' : 'Submit review'}
      </Button>
    </div>
  );
}

export default ReviewForm;