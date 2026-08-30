'use client';

import { useState, FormEvent } from 'react';
import type { ReviewRow } from '@/lib/reviews';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  reviews: ReviewRow[];
}

function StarsDisplay({ n }: { n: number }) {
  return <span className="pdp-reviews__stars" aria-hidden="true">{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function ProductReviews({ productId, productName, reviews }: ProductReviewsProps) {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const average = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim() || rating < 1) {
      setStatus('error');
      setErrorMsg('Merci de renseigner votre nom, une note et un commentaire.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, authorName, rating, comment }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('sent');
        setAuthorName('');
        setRating(0);
        setComment('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Impossible d’envoyer votre avis pour le moment.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Impossible d’envoyer votre avis pour le moment.');
    }
  };

  return (
    <section className="pdp-reviews" aria-labelledby="pdp-reviews-title">
      <div className="pdp-reviews__summary">
        <h2 id="pdp-reviews-title" className="h-display h3" style={{ margin: 0 }}>Avis clients</h2>
        {reviews.length > 0 && (
          <span>
            <StarsDisplay n={Math.round(average)} /> <strong>{average.toFixed(1)}/5</strong> · {reviews.length} avis
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="pdp-reviews__empty">Ce produit n&apos;a pas encore reçu d&apos;avis. Soyez le premier à donner votre avis.</p>
      ) : (
        <div className="pdp-reviews__list">
          {reviews.map((r) => (
            <div key={r.id} className="pdp-reviews__item">
              <div className="pdp-reviews__item-head">
                <span className="pdp-reviews__author">{r.author_name}</span>
                <StarsDisplay n={r.rating} />
                <span className="pdp-reviews__date">{fmtDate(r.created_at)}</span>
              </div>
              <p className="pdp-reviews__comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {status === 'sent' ? (
        <p className="pdp-reviews__form-msg pdp-reviews__form-msg--ok">
          Merci ! Votre avis a bien été envoyé et sera visible après modération.
        </p>
      ) : (
        <form className="pdp-reviews__form" onSubmit={handleSubmit}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>Laisser un avis sur {productName}</p>
          <div className="pdp-reviews__form-row">
            <label htmlFor="review-name">Votre nom</label>
            <input id="review-name" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={80} required />
          </div>
          <div className="pdp-reviews__form-row">
            <label id="review-rating-label">Note</label>
            <div className="pdp-reviews__rating" role="radiogroup" aria-labelledby="review-rating-label">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  className={n <= rating ? 'is-active' : ''}
                  onClick={() => setRating(n)}
                >
                  {n <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
          <div className="pdp-reviews__form-row">
            <label htmlFor="review-comment">Votre commentaire</label>
            <textarea id="review-comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} required />
          </div>
          {status === 'error' && <p className="pdp-reviews__form-msg pdp-reviews__form-msg--error">{errorMsg}</p>}
          <button type="submit" className="btn btn--primary" disabled={status === 'sending'} style={{ alignSelf: 'flex-start' }}>
            {status === 'sending' ? 'Envoi…' : 'Envoyer mon avis'}
          </button>
        </form>
      )}
    </section>
  );
}
