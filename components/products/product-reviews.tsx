'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  user: {
    name: string | null
    image: string | null
  }
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Reset form
      setRating(5)
      setComment('')
      // TODO: Update reviews list without full page refresh
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-bold'>Customer Reviews</h2>

      {/* Review Form */}
      {session ? (
        <form onSubmit={handleSubmitReview} className='space-y-4'>
          <div>
            <div className='text-sm font-medium mb-2'>Your Rating</div>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  className='focus:outline-none'
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-primary text-primary'
                        : 'fill-muted text-muted'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className='text-sm font-medium mb-2'>Your Review</div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Write your review here...'
              required
            />
          </div>

          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      ) : (
        <div className='bg-muted p-4 rounded-lg'>
          <p>Please sign in to leave a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className='space-y-6'>
        {reviews.length === 0 ? (
          <p className='text-muted-foreground'>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage src={review.user.image || undefined} />
                  <AvatarFallback>
                    {review.user.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{review.user.name}</div>
                  <div className='text-sm text-muted-foreground'>
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-primary text-primary'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>

              {review.comment && <p className='text-sm'>{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
