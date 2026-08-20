import React from 'react';
import { UserFeedback } from '../types/stellar';
import { Star, MessageSquareHeart, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/helpers';

interface FeedbackSummaryProps {
  feedbackList: UserFeedback[];
  averageRating: number;
  totalCount: number;
  onOpenModal: () => void;
}

export const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({
  feedbackList,
  averageRating,
  totalCount,
  onOpenModal,
}) => {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'UI_UX': return '🎨 UI / UX Design';
      case 'TRANSACTION_SPEED': return '⚡ Speed & Finality';
      case 'WALLET_EXPERIENCE': return '👛 Wallet Flow';
      case 'TRANSPARENCY': return '🛡️ Transparency & Trust';
      case 'FEATURE_REQUEST': return '💡 Feature Request';
      default: return '💬 General';
    }
  };

  return (
    <div className="card feedback-summary-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <MessageSquareHeart size={22} className="text-rose" />
          <h3 className="section-heading">User Validation & Product Reviews</h3>
        </div>
        <button className="btn-secondary btn-give-feedback" onClick={onOpenModal}>
          <Plus size={16} />
          <span>Leave Feedback</span>
        </button>
      </div>

      <p className="section-subtext">
        Real user validation feedback collected from onboarded community donors, grassroots medical volunteers, and disaster shelter coordinators on Stellar Testnet.
      </p>

      {/* Aggregate Rating Stat Card */}
      <div className="feedback-stats-banner">
        <div className="rating-score-col">
          <span className="rating-big-num">{averageRating.toFixed(1)}</span>
          <div className="rating-stars-cluster">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= Math.round(averageRating) ? 'star-filled text-amber' : 'text-muted'}
                />
              ))}
            </div>
            <span className="rating-count-text">Based on {totalCount} Verified Reviews</span>
          </div>
        </div>

        <div className="rating-badges-col">
          <div className="kpi-pill">
            <CheckCircle2 size={13} className="text-emerald" />
            <span>100% On-Chain Verifiable</span>
          </div>
          <div className="kpi-pill">
            <Sparkles size={13} className="text-amber" />
            <span>5 Wallets Tested</span>
          </div>
        </div>
      </div>

      {/* User Feedback Reviews List */}
      <div className="feedback-reviews-list">
        {feedbackList.map((fb) => (
          <div key={fb.id} className="feedback-review-item">
            <div className="review-header">
              <div className="review-user-info">
                <span className="review-user-name">{fb.userName}</span>
                <span className="review-user-role">{fb.userRole}</span>
              </div>

              <div className="review-meta">
                <div className="review-stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= fb.rating ? 'star-filled text-amber' : 'text-muted'}
                    />
                  ))}
                </div>
                <span className="review-time">{formatTimestamp(fb.timestamp)}</span>
              </div>
            </div>

            <div className="review-category-tag">
              {getCategoryLabel(fb.category)}
            </div>

            <p className="review-comment">"{fb.comment}"</p>

            {fb.featureRequest && (
              <div className="review-feature-box">
                <div className="feature-req-label">
                  <Sparkles size={12} className="text-amber" />
                  <strong>Suggested Feature:</strong>
                </div>
                <p className="feature-req-text">{fb.featureRequest}</p>
              </div>
            )}

            {fb.walletAddress && (
              <div className="review-footer-address">
                <span>Verified Wallet:</span>
                <span className="mono-text">{formatAddress(fb.walletAddress, 6, 6)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
