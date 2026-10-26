import { StarIcon } from './Icons'

export default function Rating({ rating, reviews }) {
  return (
    <div className="rating" title={`${rating} out of 5`}>
      <span className="stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= Math.round(rating)} />
        ))}
      </span>
      <span className="rating-score">{rating.toFixed(1)}</span>
      {reviews ? <span className="rating-count">({reviews})</span> : null}
    </div>
  )
}
