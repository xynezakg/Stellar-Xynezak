import React, { useState } from 'react';
import { FeedbackCategory } from '../types/stellar';
import { X, Star, MessageSquareHeart, Send, CheckCircle2, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    userName: string;
    userRole: string;
    rating: number;
    category: FeedbackCategory;
    comment: string;
    featureRequest?: string;
  }) => void;
  userAddress?: string | null;
}

const CATEGORIES: { id: FeedbackCategory; label: string; emoji: string }[] = [
  { id: 'UI_UX', label: 'UI / UX Design', emoji: '🎨' },
  { id: 'TRANSACTION_SPEED', label: 'Speed & Finality', emoji: '⚡' },
  { id: 'WALLET_EXPERIENCE', label: 'Wallet Connection', emoji: '👛' },
  { id: 'TRANSPARENCY', label: 'Transparency & Trust', emoji: '🛡️' },
  { id: 'FEATURE_REQUEST', label: 'Feature Request', emoji: '💡' },
  { id: 'GENERAL', label: 'General Feedback', emoji: '💬' },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userAddress,
}) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Community Supporter');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory>('UI_UX');
  const [comment, setComment] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmit({
      userName: userName.trim() || 'Anonymous Supporter',
      userRole: userRole.trim() || 'Community Member',
      rating,
      category,
      comment: comment.trim(),
      featureRequest: featureRequest.trim() || undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setComment('');
      setFeatureRequest('');
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content feedback-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close feedback modal">
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div className="modal-body success-body">
            <div className="modal-icon-wrapper success-icon-wrapper">
              <CheckCircle2 size={54} className="text-emerald" />
            </div>
            <h3 className="modal-title">Thank You For Your Feedback!</h3>
            <p className="modal-description">
              Your review and feature suggestions have been submitted to the AidPact Product Development ledger.
            </p>
          </div>
        ) : (
          <div className="feedback-modal-body">
            <div className="feedback-header">
              <div className="modal-icon-badge">
                <MessageSquareHeart size={26} className="text-rose" />
              </div>
              <h3 className="modal-title">User Validation & Feedback</h3>
              <p className="modal-description">
                Help us improve AidPact for disaster relief operations on Stellar. Your feedback directly shapes our product roadmap.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Star Rating */}
              <div className="form-group star-rating-group">
                <label className="form-label text-center">How was your experience using AidPact?</label>
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        size={28}
                        className={
                          (hoverRating || rating) >= star
                            ? 'star-filled text-amber'
                            : 'star-empty text-muted'
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="rating-text-label">
                  {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ Exceptional & Transparent!'}
                  {rating === 4 && '⭐️⭐️⭐️⭐️ Very Good & Fast'}
                  {rating === 3 && '⭐️⭐️⭐️ Average Experience'}
                  {rating === 2 && '⭐️⭐️ Needs Improvement'}
                  {rating === 1 && '⭐️ Poor Experience'}
                </span>
              </div>

              {/* Category Selector */}
              <div className="form-group">
                <label className="form-label">Feedback Category</label>
                <div className="feedback-category-chips">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-chip ${category === cat.id ? 'cat-chip-active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Role */}
              <div className="form-row-dual">
                <div className="form-group">
                  <label htmlFor="fb-name" className="form-label">
                    Your Name / Nickname
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Maria Santos"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fb-role" className="form-label">
                    Your Role / Community
                  </label>
                  <input
                    id="fb-role"
                    type="text"
                    className="form-input"
                    placeholder="e.g. OFW Donor / Evacuee"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                </div>
              </div>

              {/* Comment */}
              <div className="form-group">
                <label htmlFor="fb-comment" className="form-label">
                  Your Review / Usability Experience <span className="text-rose">*</span>
                </label>
                <textarea
                  id="fb-comment"
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="What did you like most about the wallet connection, donation flow, or on-chain transparency?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              {/* Feature Request */}
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="fb-feature" className="form-label">
                    Feature Request or Suggestion (Optional)
                  </label>
                  <span className="feature-req-badge">
                    <Sparkles size={11} /> Roadmap Idea
                  </span>
                </div>
                <input
                  id="fb-feature"
                  type="text"
                  className="form-input"
                  placeholder="e.g. GCash on-ramp, SMS claim alerts, Tagalog localization..."
                  value={featureRequest}
                  onChange={(e) => setFeatureRequest(e.target.value)}
                />
              </div>

              {userAddress && (
                <span className="wallet-verified-note">
                  Verified Wallet: <code>{userAddress.slice(0, 6)}...{userAddress.slice(-6)}</code>
                </span>
              )}

              <button type="submit" className="btn-primary btn-submit-feedback">
                <Send size={18} />
                <span>Submit Feedback & Rating</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
